<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left border-right">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="overview-right-content">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :score="seller.serviceScore" :size="36"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :score="seller.foodScore" :size="36"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
      </div>
      <split></split>
      <rating-check :ratings="ratings" mode-type="complex"></rating-check>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import split from 'components/common/split/split'
import star from 'components/common/star/star'
import ratingCheck from 'components/pages/ratingCheck/ratingCheck'
// 导入better-scroll
import BScroll from 'better-scroll'

// 请求状态码赋值给常量好处：语义化，如果后期变更状态码值只需改动一处。
const ERRNO_OK = 0

export default {
  name: 'ratings',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: []
    }
  },
  components: {
    split,
    star,
    ratingCheck
  },
  methods: {
    getRatings () {
      axios.get('/api/ratings').then(this.getRatingsSucc).catch(this.getRatingsErr)
    },
    getRatingsSucc (res) {
      const result = res.data
      if (result.errno === ERRNO_OK && result.data) {
        this.ratings = result.data
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.ratings)
          } else {
            this.scroll.refresh()
          }
        })
      }
    },
    getRatingsErr (err) {
      console.log(err)
    }
  },
  created () {
    this.getRatings()
  }
}
</script>

<style lang="stylus" scoped>
  .ratings
    position: absolute
    top: 3.52rem
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: .36rem 0
      .overview-left
        flex: 0 0 2.74rem
        width: 2.74rem
        padding: .16rem 0
        text-align: center
        @media screen and (max-width: 320px) /* 媒体查询不能用 rem 单位，320px 对应iphone4/5 */
          flex: 0 0 2.4rem
          width: 2.4rem
        &::before
          border-right-color: rgba(7,17,27,.1)
        .score
          margin-bottom: .12rem
          line-height: .56rem
          font-size: .48rem
          color: #f90
        .title
          margin-bottom: .16rem
          line-height: .24rem
          font-size: .24rem
          color: #07111b
        .rank
          line-height: .2rem
          font-size: .2rem
          color: #93999f
      .overview-right
        flex: 1
        padding-left: .48rem
        display: flex
        align-items: center
        @media screen and (max-width: 320px)
          padding-left: .12rem
        .score-wrapper
          margin-bottom: .16rem
          font-size: 0
          .title
            font-size: .24rem
            line-height: .36rem
            color: #07111b
          .star
            margin: 0 .24rem
            vertical-align: -.04rem
          .score
            font-size: .24rem
            line-height: .36rem
            color: #f90
        .delivery-wrapper
          font-size: 0
          .title
            line-height: .36rem
            font-size: .24rem
            color: #07111b
          .delivery
            margin-left: .24rem
            font-size: .24rem
            color: #93999f
</style>
