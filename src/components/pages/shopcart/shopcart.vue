<template>
  <div class="shopcart">
    <!--  @click="showList" 展开或折叠购物车列表 -->
    <div class="content" @click="showList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
            <span class="icon-shopping_cart"></span>
          </div>
        </div>
        <div class="price border-right" :class="{'highlight': totalCount > 0}">
          ￥{{totalPrice}}
        </div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay"
             :class="this.totalPrice < this.minPrice ? 'not-enough' : 'enough'"
             @click.stop.prevent="pay"
        >{{payDesc}}</div>
      </div>
    </div>
    <!-- 购物车列表 -->
    <transition name="flod">
      <div class="cart-list" v-show="show">
        <div class="list-header border-bottom">
          <span class="title">购物车</span>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="product border-bottom" v-for="(pro, index) in selectPros" :key="index">
              <span class="name">{{pro.name}}</span>
              <div class="price"><span class="unit">￥</span>{{pro.price * pro.count}}</div>
              <div class="counter-wrapper">
                <counter :pro="pro"></counter>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!-- 遮罩 -->
    <transition name="fade">
      <div class="mask" v-show="show" @click="showList"></div>
    </transition>
  </div>
</template>

<script>
import counter from 'components/common/counter/counter'
// 导入better-scroll
import BScroll from 'better-scroll'
export default {
  name: 'shopcart',
  props: {
    selectPros: { // 全部已选择商品集合（数组）
      type: Array
    },
    deliveryPrice: { // 配送费
      type: Number,
      default: 0
    },
    minPrice: { // 起送费
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      expand: false, // 标记当前购物车列表是否展开
      show: false // 决定购物车列表是否展开
    }
  },
  components: {
    counter
  },
  computed: {
    totalPrice () { // 计算订单总金额
      let total = 0
      this.selectPros.forEach((Pro) => {
        total += Pro.price * Pro.count
      })
      /* for (let i = 0; i < this.selectPros.length; i++) {
        total += this.selectPros[i].price * this.selectPros[i].count
      } */
      return total
    },
    totalCount () { // 计算订单总量
      let count = 0
      this.selectPros.forEach((Pro) => {
        count += Pro.count
      })
      return count
    },
    payDesc () { // 购买按钮说明
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    }
  },
  watch: {
    totalCount () {
      // 当商品总数为0且购物车列表展开时
      if (!this.totalCount && this.expand) {
        this.expand = false // 标记当前购物车列表不展开
        this.show = false // 购物车列表不展开
      }
    }
  },
  methods: {
    showList () { // 点击购物车面板展开或折叠购物车列表
      if (this.totalCount) { // 当商品总数不为0
        if (!this.expand) { // 当前购物车列表没有展开
          this.expand = true // 标记为展开
          this.show = true // 展开购物车列表
        } else { // 当前购物车列表展开
          this.expand = false // 标记为不展开
          this.show = false // 不展开购物车列表
        }
        if (this.show) { // 因为购物车列表内容是会发生变化的，所以每次展开列表需要重新计算DOM高度
          // 加载BScroll时机（购物车列表展开）
          this.$nextTick(() => { // 由数据变化再到DOM变化有个tick过程
            // 因为会有多次展开购物车列表情景，所以判断下不必每次都初始化Better-Scroll
            if (!this.listContent) { // 第一次展开，初始化Better-Scroll
              /* this.listContent = new BScroll(this.$refs.listContent, {
               scrollbar: { // 启用滚动条
               fade: true, // 当滚动停止时滚动条是否需要渐隐
               interactive: false // 1.8.0 新增，表示滚动条是否可以交互
               }
               }) */
              this.listContent = new BScroll(this.$refs.listContent)
            } else { // 之后每次展开购物车列表时，Better-Scroll 刷新就可以重新计算DOM高度了
              this.listContent.refresh()
            }
          })
        }
      }
    },
    empty () { // 清空购物车
      this.selectPros.forEach((pro) => { // 全部已选商品数量设为零
        pro.count = 0
      })
    },
    pay () { // 结算
      if (this.totalPrice < this.minPrice) { // 当订单总额大于起送费执行结算
        let diff = this.minPrice - this.totalPrice
        alert(`该笔订单未达起送条件，还差${diff}元`)
        return false
      }
      alert(`订单需要支付${this.totalPrice}元`)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    .content
      display: flex
      height: .96rem
      color: #80858a
      background-color: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          position: relative
          top: -.2rem
          display: inline-block
          margin: 0 .24rem
          padding: .12rem
          width: 1.12rem
          height: 1.12rem
          border-radius: 50%
          background-color: #141d27
          .logo
            position: relative
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background-color: #2b343c
            &.highlight
              background-color: #00a0dc
              .icon-shopping_cart
                color: #fff
            .num
              position: absolute;
              top: -.13rem;
              right: 0;
              transform: translateX(40%)
              padding: 0 .1rem
              min-width: .36rem;
              height: .36rem;
              line-height: .36rem;
              text-align: center;
              border-radius: .36rem;
              font-size: .2rem;
              color: #fff;
              background: #f01414;
              box-shadow: 0 4px 8px 0 rgba(0,0,0,.4)
            .icon-shopping_cart
              font-size: .6rem
              line-height: .88rem
              font-size: .48rem
        .price
          display: inline-block
          vertical-align: top
          margin-top: .24rem
          padding-right: .24rem
          height: .48rem
          line-height: .48rem
          font-size: .32rem
          font-weight: 700
          &.highlight
            color: #fff
          &::before
            border-right-color: rgba(255, 255, 255, .5)
        .desc
          display: inline-block
          vertical-align: top
          margin: .24rem 0 0 .24rem
          height: .48rem
          line-height: .48rem
          font-size: .2rem
      .content-right
        flex: 0 0 2.1rem
        .pay
          height: .96rem
          line-height: .96rem
          font-size: .24rem
          font-weight: 700
          text-align: center
          &.not-enough
            background-color: #2b333b
          &.enough
            color: #fff
            background-color: #00b43c
    .cart-list
      position: absolute
      top: 0
      left: 0
      right: 0
      z-index: -1
      transform: translate3D(0,-100%,0)
      transition: all .4s
      /* 展开或折叠购物车列表动画 */
      &.flod-enter
        transform: translate3D(0,0,0)
      &.flod-leave-active
        transform: translate3D(0,100%,0)
      .list-header
        height: .8rem
        line-height: .8rem
        background-color: #f3f5f7
        &::before
          border-bottom-color: rgba(7, 17, 27, 0.2)
        .title
          float: left
          padding-left: .36rem
          font-size: .28rem
          color: #07111b
        .empty
          float: right
          padding: 0 .36rem
          font-size: .24rem
          color: #00a0dc
      .list-content
        padding: 0 .36rem;
        max-height: 4.4rem;
        overflow: hidden;
        background: #fff;
        .product
          position: relative
          padding: .24rem 0px
          &::before
            border-bottom-color: rgba(7, 17, 27, 0.3)
          .name
            line-height: .48rem;
            font-size: .28rem
            color: #07111b;
          .price
            position: absolute
            top: .24rem
            right: 2rem
            line-height: .48rem
            font-size: .28rem
            font-weight: 700
            color: #f01414
            .unit
              font-size: .2rem
              font-weight: normal
          .counter-wrapper
            position: absolute
            top: .24rem
            right: 0
    .mask
      position: fixed
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: -2
      opacity: 1
      transition: all .4s
      background-color: rgba(0, 0, 0, .7)
      backdrop-filter: blur(10px)
      &.fade-enter, &.fade-leave-active /* 遮罩层动画 */
        opacity: 0
        background-color: rgba(0, 0, 0, 0)
</style>
