<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="support">
          <!-- 值跟类名映射，类名决定显示哪张图片 -->
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div v-if="seller.supports" class="support-count">
          <span class="count">{{seller.supports.length}}个</span>
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="bgPic">
      <img :src="seller.avatar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    seller: Object
  },
  data () {
    return {
      // 用于数组下标映射
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~stylus/mixin"
  .header
    position: relative
    color: #fff
    background-color: rgba(7, 17, 27, .5)
    .content-wrapper
      position: relative
      padding: .48rem .24rem .36rem .48rem
      overflow: hidden
      .avatar
        float: left
        img
          margin-right: .32rem
          width: 1.28rem
          height: 1.28rem
          object-fit: cover
      .content
        .title
          margin: .04rem 0 .16rem 0
          font-size: 0
          .brand
            display: inline-block
            vertical-align: top
            margin-right: .12rem
            width: .6rem
            height: .36rem
            bgImg('images/brand')
          .name
            font-size: .32rem
            font-weight: bold
            line-height: .36rem
        .description
          margin-top: .16rem
          margin-bottom: .2rem
          font-size: .24rem
          color: #ffffff
          font-weight: 200
          line-height: .24rem
        .support
          margin-bottom: .04rem
          font-size: 0
          .icon
            display: inline-block
            margin-right: .08rem
            vertical-align: top
            width: .24rem
            height: .24rem
            &.decrease
              bgImg('images/decrease_1')
            &.discount
              bgImg('images/discount_1')
            &.guarantee
              bgImg('images/guarantee_1')
            &.invoice
              bgImg('images/invoice_1')
            &.special
              bgImg('images/special_1')
          .text
            /* 手机上支持10px字体大小 */
            font-size: .2rem
            color: #fff
            font-weight: 200
            line-height: .24rem
        .support-count
          position: absolute
          bottom: .36rem
          right: .24rem
          display: flex
          align-items: center
          padding: 0 .16rem
          height: .48rem
          border-radius: .24rem
          font-size: 0
          text-align: center
          background-color: rgba(0, 0, 0, .2)
          .count
            font-size: .2rem
            font-weight: 200
            line-height: .24rem
          .icon-keyboard_arrow_right
            margin-left: .04rem
            font-size: .2rem
    .bulletin-wrapper
      position: relative
      padding: 0 .8rem 0 .24rem
      height: .56rem
      line-height: .56rem
      ellipse()
      background-color: rgba(7, 17, 27, .2)
      .bulletin-icon
        margin-right: .08rem
        display: inline-block
        width: .44rem
        height: .24rem
        vertical-align: middle
        bgImg('images/bulletin')
      .bulletin-text
        color: #fff
        font-size: .2rem
        font-weight: 200
        line-height: .28rem
      .icon-keyboard_arrow_right
        position: absolute
        top: .16rem
        right: .24rem
        font-size: .2rem
    .bgPic
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      z-index: -1
      overflow: hidden
      filter: blur(10px)
      img
        width: 100%
        height: 200%
</style>
