<template>
  <transition name="move">
    <div class="product-detail" v-show="showFlag" ref="productDetail">
      <div class="detail-content">
        <div class="product-image">
          <img :src="productInfo.image" alt="">
          <div class="back" @click="back"><span class="icon-arrow_lift"></span></div>
        </div>
        <div class="product-info">
          <div class="title">{{productInfo.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{productInfo.sellCount}}份</span>
            <span class="rate">好评率{{productInfo.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{productInfo.price}}</span>
            <span class="old" v-if="productInfo.oldPrice > 0">￥{{productInfo.oldPrice}}</span>
          </div>
          <div class="counter-wrapper">
            <counter :pro="productInfo"></counter>
          </div>
          <transition name="fade">
            <!--如果数量值不存在或数量为0，显示加入购物车按钮-->
            <div
              class="buy"
              @click.stop.prevent="buy"
              v-show="!productInfo.count || productInfo.count === 0"
            >加入购物车</div>
          </transition>
        </div>
        <!--商品信息-->
        <split v-if="productInfo.info"></split><!--分隔组件-->
        <div class="product-desc" v-if="productInfo.info">
          <div class="title">商品介绍</div>
          <p class="desc">{{productInfo.info}}}</p>
        </div>
        <!--商品评价-->
        <split></split><!--分隔组件-->
        <div class="rating">
          <div class="title">商品评价</div>
          <!--查看评论内容组件-->
          <ratingCheck
            ref="ratingCheck"
            :ratings="productInfo.ratings"
            :select-type="selectType"
            :only-content="onlyContent"
            :type-desc="typeDesc"
          ></ratingCheck>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import counter from 'components/common/counter/counter'
import split from 'components/common/split/split'
import ratingCheck from 'components/pages/ratingCheck/ratingCheck'
// 导入better-scroll
import BScroll from 'better-scroll'
export default {
  name: 'detail',
  props: {
    productInfo: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false, // 是否显示详情页阀值
      /* 向查看评论组件传入的数据 */
      selectType: 0, // 当前选择的类型（0全部，1推荐，2吐槽）
      onlyContent: false, // 是否只看有内容的评价
      typeDesc: { // 类型名称
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    counter,
    split,
    ratingCheck
  },
  methods: {
    // 显示详情页组件
    show () {
      this.showFlag = true
      // 每次显示详情组件时，调用 ratingCheck.vue 组件的 initRating() 方法初始化评论组件
      this.$refs.ratingCheck.initRating(this.onlyContent, this.selectType)
      // 加载 better-scroll 时机（显示详情页组件）
      /* better-scroll 的初始化时机很重要，因为它在初始化的时候，会计算父元素和子元素的高度和宽度，来决定是否可以纵向和横向滚动。
      因此，我们在初始化它的时候，必须确保父元素和子元素的内容已经正确渲染了。如果子元素或者父元素 DOM 结构发生改变的时候，
      必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常。 */
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.productDetail)
        } else {
          this.scroll.refresh()
        }
      })
    },
    // 隐藏详情页组件
    back () {
      this.showFlag = false
    },
    // 加入购物车
    buy () {
      if (!this.productInfo.count) { // 如果数量值不存在或为零，赋值为1
        this.$set(this.productInfo, 'count', 1)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .product-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: .96rem
    z-index: 40
    background-color: #fff
    transform: translate3D(0, 0, 0)
    transition: transform .4s
    &.move-enter,&.move-leave-active
      transform: translate3D(100%, 0, 0)
    .product-image
      position: relative
      overflow: hidden
      width: 100%
      height: 0
      padding-bottom: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        left: 0
        top: .2rem
        span
          display: block
          padding: .2rem
          font-size: .4rem
          color: #fff
    .product-info
      position: relative
      padding: .36rem
      .title
        line-height: .28rem
        margin-bottom: .16rem
        font-size: .28rem
        font-weight: 700
        color: #07111b
      .detail
        margin-bottom: .36rem
        line-height: .2rem
        height: .2rem
        font-size: 0
        color: #93999f
        .sell-count,.rate
          font-size: .2rem
        .sell-count
          margin-right: .24rem
      .price
        height: .48rem
        line-height: .48rem
        font-size: 0
        font-weight: 700
        .now
          margin-right: .16rem
          font-size: .28rem
          color: #f01414
        .old
          font-size: .2rem
          text-decoration: line-through
          color: #93999f;
      .counter-wrapper, .buy
        position: absolute
        right: .36rem
        bottom: .36rem
      .buy
        height: .48rem;
        line-height: .48rem;
        padding: 0 .24rem;
        border-radius: .24rem;
        font-size: .2rem;
        color: #fff;
        background: #00a0dc;
        opacity: 1;
        transition: opacity .2s
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .product-desc
      padding: .36rem
      background-color: #fff
      .title
        line-height: .28rem
        margin-bottom: .12rem
        font-size: .28rem
        color: #07111b
      .desc
        line-height: .48rem
        padding: 0 .16rem
        font-size: .24rem
        color: #4d555d
    .rating
      padding-top: .36rem
      background-color: #fff
      .title
        padding-left: .36rem
        line-height: .28rem
        font-size: .28rem
        color: #07111b
</style>
