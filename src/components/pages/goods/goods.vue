<template>
  <div class="goods">
    <!--左侧分类-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item menu-item-hook"
            v-for="(item, key) in goods"
            :key="key"
            :class="{'current': currIndex === key}"
            @click="_scrollFood(key)"
        >
          <div class="item-wrapper border-bottom">
            <icons v-if="item.type >= 0" :sub="item.type" :size="2"></icons>
            <span class="menu-text">{{item.name}}</span>
          </div>
        </li>
      </ul>
    </div>
    <!--右侧列表-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.name" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul v-if="item.foods">
            <li
              class="food-item border-bottom"
              v-for="food in item.foods"
              :key="food.name"
              @click="_showDetail(food)"
            >
              <div class="foodIcon">
                <img :src="food.icon" alt="">
              </div>
              <div class="foodInfo">
                <h2 class="name">{{food.name}}</h2>
                <p v-if="food.description" class="desc">{{food.description}}</p>
                <p class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </p>
                <div class="price">
                  <span class="now"><em class="unit">￥</em>{{food.price}}</span>
                  <span v-if="food.oldPrice" class="before"><em class="unit">￥</em>{{food.oldPrice}}</span>
                </div>
                <div class="counter-wrapper" @click.stop.prevent>
                  <!--调用计数器组件，:pro="food" 传入当前商品数据-->
                  <counter :pro="food"></counter>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车-->
    <!--
      向购物车组件传递：
        deliveryPrice配送费，
        minPrice起送费，
        selectPros所有被选择的商品集合
    -->
    <shopcart
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
      :select-pros="selectPros"
    ></shopcart>
    <!--点击商品查看商品详情页时，把当前商品数据传递给 detail.vue 组件-->
    <!--ref="productDetail" 用于父组件调用子组件方法-->
    <product-detail
      :product-info="productInfo"
      ref="productDetail"
    ></product-detail>
  </div>
</template>

<script>
import axios from 'axios'
import icons from 'components/common/icons/icon'
import shopcart from 'components/pages/shopcart/shopcart'
import counter from 'components/common/counter/counter'
import productDetail from 'components/pages/productDetail/detail'
// 导入better-scroll
import BScroll from 'better-scroll'

// 请求状态码赋值给常量好处：语义化，如果后期变更状态码值只需改动一处。
const ERRNO_OK = 0

export default {
  name: 'goods',
  components: {
    icons,
    shopcart,
    counter,
    productDetail
  },
  props: {
    seller: { // 接收卖家数据（来源：App.vue <router-view :seller="seller"/>）
      type: Object
    }
  },
  data () {
    return {
      goods: [], // 接收商品数据
      listHeight: [], // 存放食物列表每个分类的区间高度
      scrollY: 0, // 存放foods-wrapper容器当前滚动位置
      productInfo: {} // 存储要传递给详情页组件的商品数据
    }
  },
  computed: {
    // 根据滚动值判断落在哪个区间返回索引
    currIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let heightStart = this.listHeight[i]
        let heightEnd = this.listHeight[i + 1]
        // 判断当前滚动值落在哪个区间，返回对应区间索引。
        // 向下闭区间向上开区间
        // !heightEnd 保证获取到最后区间的索引
        if (!heightEnd || (this.scrollY >= heightStart && this.scrollY < heightEnd)) {
          // console.log(i)
          this._followScrollMenu(i) // 滚动食物列表左侧菜单跟随滚动
          return i
        }
      }
      return 0
    },
    /* 由于计数器插件（counter.vue）修改商品数量，
    所以监听商品数量变化获得要添加到购物车的商品数据 */
    selectPros () {
      let products = [] // 每个被选择的商品数据均放在这个集合中
      /* 进行两次遍历 */
      this.goods.forEach((productKind) => { // 第一次遍历（产品分类）
        productKind.foods.forEach((pro) => { // 第二次遍历（当前分类下的商品）
          if (pro.count) { // 如果当前商品数量值存在，说明商品被选择。
            products.push(pro) // 被选择商品存进数组
          }
        })
      })
      return products // 返回所有被选择的商品集合（数组）
    }
  },
  methods: {
    getGoodsData () {
      axios.get('/api/goods').then(this.getGoodsSucc).catch(this.getGoodsErr)
    },
    getGoodsSucc (res) {
      const result = res.data
      if (result.errno === ERRNO_OK && result.data) {
        this.goods = result.data
        /* vm.$nextTick( [callback] ) 将回调延迟到下次 DOM 更新循环之后执行。
        在修改数据之后立即使用它，然后等待 DOM 更新。 */
        // 由于数据是异步请求的，所以better-scroll实例化时机得推后到DOM更新结束后，这样才能得到容器准确的高度。
        this.$nextTick(() => {
          // 初始化 better-scroll
          this._initScroll()
          // 计算每个分类列表的高度
          this._calcHeight()
        })
      }
    },
    getGoodsErr (error) {
      console.log(error)
    },
    // 声明 better-scroll 初始化函数
    _initScroll () {
      /* better-scroll 自己接管了 touch 事件，而且默认会阻止浏览器默认行为，也包括点击，
      如果你只用 better-scroll（注意这里不用其它框架），
      如果 click: false，点击也是不会派发 click 事件的，只有 click: true 才可以。
      https://coding.imooc.com/learn/questiondetail/70968.html */
      /* this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      }) */
      this.menuScroll = new BScroll(this.$refs.menuWrapper)
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3 // 开启实时获取容器当前滚动位置功能
      })
      /* 典型的匿名函数 this 指针问题，你用匿名函数，执行的时候 this 指向已经不是当前的 vue 实例了，而箭头函数不存在这个问题
       * https://coding.imooc.com/learn/questiondetail/6819.html */
      this.foodsScroll.on('scroll', (pos) => { // 监听滚动获取滚动值
        // console.log(pos.y) 负数且会有小数出现
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 计算食物列表每个分类的区间高度
    _calcHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight
        this.listHeight.push(height)
      }
    },
    // 点击分类滚动到对应食物列表
    _scrollFood (index) {
      // console.log(index)
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      this.foodsScroll.scrollToElement(foodList[index], 300) // 滚动到对应DOM元素，持续时间 300ms（动画效果）
      this._followScrollMenu(index) // 点击分类，滚动到当前分类防止被隐藏
    },
    /* 右侧商品列表滑动，左侧可以加上current类，可是不随着右侧的滑动而动，这样会导致隐藏的menu出不来 */
    // 分类容器跟随滚动
    _followScrollMenu (index) {
      let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook')
      this.menuScroll.scrollToElement(menuList[index], 300, 0, -100)
    },
    // 点击商品存储商品数据（用于商品详情页数据展示）
    _showDetail (productData) {
      this.productInfo = productData // 传递要查看详情的商品数据
      this.$refs.productDetail.show() // 父组件调用子组件方法（显示详情页）
    }
  },
  created () {
    this.getGoodsData()
  }
}
</script>

<style lang="stylus" scoped>
  .goods
    position: absolute
    top: 3.52rem
    bottom: .88rem
    width: 100%
    display: flex
    overflow: hidden
    .menu-wrapper
      flex: 0 0 1.6rem
      width: 1.6rem
      background-color: #f3f5f7
      .menu-item
        display: table
        padding: 0 .24rem
        height: 1.08rem
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          font-weight: 700
          background-color: #fff
          .item-wrapper.border-bottom:before
            display: none
        .item-wrapper
          display: table-cell
          width: 1.12rem
          vertical-align: middle
          line-height: .2rem
          font-size: 0
          &.border-bottom:before
            border-color: rgba(7, 17, 27, .1)
          .menu-text
            font-size: .24rem
    .foods-wrapper
      flex: 1
      .title
        padding-left: .28rem
        height: .52rem
        line-height: .52rem
        font-size: .24rem
        border-left: .04rem solid #d9dde1
        color: #93999f
        background-color: #f3f5f7
      .food-item
        display: flex
        margin: .36rem
        padding-bottom: .36rem
        &:last-child
          margin-bottom: 0
          &::before
            display: none
        .foodIcon
          overflow: hidden;
          width: 1.2rem
          height: 0;
          padding-bottom: 1.2rem;
          img
            display: block
            width: 1.2rem
            height: 1.2rem
            object-fit: cover
        .foodInfo
          flex: 1
          margin-left: .2rem
          .name
            margin: .04rem 0 .16rem
            height: .28rem
            line-height: .28rem
            font-size: .28rem
            color: #07111b
          .desc,.extra
            margin-bottom: .16rem
            line-height: .24rem
            font-size: .2rem
            color: #93999f
          .extra
            margin-bottom: 0
            .count
              margin-right: .24rem
          .price
            height: .52rem
            font-size: 0
            font-weight: 700;
            .now
              position: relative
              top: 0.14rem;
              margin-right: .16rem
              font-size: .28rem
              font-weight: 700
              color: #f01414
            .before
              position: relative
              top: .12rem
              font-size: .2rem
              font-weight: 700
              text-decoration: line-through
              color: #93999f
            .unit
              font-size: .2rem
              font-style: normal
          .counter-wrapper
            position: absolute
            right: 0
            bottom: .36rem
</style>
