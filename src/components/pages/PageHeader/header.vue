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
          <!--图标组件-->
          <icons v-if="seller.supports[0].type >= 0" :sub="seller.supports[0].type"></icons>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDatail">
          <span class="count">{{seller.supports.length}}个</span>
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDatail">
      <span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="bgPic">
      <img :src="seller.avatar">
    </div>
    <!--CSS Sticky Footer-->
    <transition name="fade">
      <div class="detail" v-show="datailShow">
        <div class="detailWrapper clearfix">
          <div class="detailContent">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <!--star组件接受两个参数-->
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="infoWrapper">
              <div class="title">
                <div class="line border-bottom"></div>
                <div class="text">优惠信息</div>
                <div class="line border-bottom"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li class="support-item" v-for="item in seller.supports" :key="item.type">
                  <!--图标组件-->
                  <icons v-if="item.type >= 0" :sub="item.type" :size="1"></icons>{{item.description}}
                </li>
              </ul>
            </div>
            <div class="infoWrapper">
              <div class="title">
                <div class="line border-bottom"></div>
                <div class="text">商家公告</div>
                <div class="line border-bottom"></div>
              </div>
              <p class="overview">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
        </div>
        <div class="close" @click="showDatail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from 'components/common/star/star'
import icons from 'components/common/icons/icon'
export default {
  name: 'PageHeader',
  props: {
    seller: Object
  },
  data () {
    return {
      datailShow: false
    }
  },
  methods: {
    showDatail () {
      this.datailShow = !this.datailShow
    }
  },
  components: {
    star,
    icons
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixin"
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
    /*CSS Sticky Footer 布局*/
    .fade-enter,.fade-leave-to
      opacity: 0
    .fade-enter-to
      opacity: 1
      transition: opacity .5s
    .fade-leave-active
      transition: opacity .3s
    .detail
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 100
      overflow: auto
      background-color: rgba(7, 17, 27, .8)
      backdrop-filter: blur(10px)
      .detailWrapper
        width: 100%
        min-height: 100% /*如果内容不够长时，也保证内容有全屏长度*/
        .detailContent
          margin-top: 1.28rem
          padding-bottom: 1.28rem /*保证内容content区域的底部有50px的空白*/
          color: #fff
          .name
            line-height: .32rem
            text-align: center
            font-size: .32rem
            font-weight: 700
          .star-wrapper
            margin-top: .36rem
            text-align: center
          .infoWrapper
            width: 80%
            margin: .6rem auto 0
            .title
              display: flex
              align-items: center
              .line
                flex: 1
                &:before
                  border-bottom-color: rgba(255, 255, 255, .5);
              .text
                padding: 0 .24rem
                font-size: .28rem
                font-weight: 700
            .supports
              padding-top: .48rem
              .support-item
                margin-bottom: .24rem
                font-size: .24rem
                font-weight: 200
                line-height: .24rem
                &:last-child
                  margin-bottom: 0
            .overview
              padding-top: .48rem
              line-height: .4rem
              font-size: .24rem
              font-weight: 200
      .close
        margin: -1.28rem auto 0
        text-align: center
        font-size: .64rem
        color: rgba(255, 255, 255, .5)
</style>
