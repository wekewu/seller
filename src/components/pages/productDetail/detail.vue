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
            <span class="rating">好评率{{productInfo.rating}}%</span>
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
              @click="buy"
              v-show="!productInfo.count || productInfo.count === 0"
            >加入购物车</div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import counter from 'components/common/counter/counter'
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
      showFlag: false // 是否显示详情页阀值
    }
  },
  components: {
    counter
  },
  methods: {
    // 显示详情页组件
    show () {
      this.showFlag = true
      // 加载BScroll时机（显示详情页组件）
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
        .sell-count,.rating
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
</style>
