<template>
  <div class="rating-check">
    <!--要先判断 ratings 存在，才能访问它下面的属性 ratings.length-->
    <div class="rating-type border-bottom" v-if="ratings">
      <span
        class="item positive"
        :class="{'active': currentType === 0}"
        @click="_selectType(0)"
      >
        {{typeDesc.all}}
        <em class="count">{{ratings.length}}</em>
      </span>
      <span
        class="item positive"
        :class="{'active': currentType === 1}"
        @click="_selectType(1)"
      >
        {{typeDesc.positive}}
        <em class="count">{{positives.length}}</em>
      </span>
      <span
        class="item negative"
        :class="{'active': currentType === 2}"
        @click="_selectType(2)"
      >
        {{typeDesc.negative}}
        <em class="count">{{negatives.length}}</em>
      </span>
    </div>
    <!--只看有内容的评价-->
    <div class="switch border-bottom" :class="{'on': checkContent}" @click="_checkContent">
      <span class="iconfont check-circle">&#xe629;</span>
      <span class="text">只看有内容的评价</span>
    </div>
    <!--评论内容列表-->
    <div class="rating-wrapper">
      <!-- ratings && ratings.length （是否有评论数组且数组长度不为0）-->
      <ul v-show="ratings && ratings.length">
        <li
          v-show="_needShow(rating.rateType, rating.text)"
          v-for="(rating, index) in ratings"
          :key="index"
          class="rating-item border-bottom"
        >
          <!-- 简洁评论内容区块 -->
          <div class="simple"
               v-if="modeType === 'simple' ? true : false"
          >
            <div class="user">
              <span class="name">{{rating.username}}</span>
              <img class="avatar" :src="rating.avatar" alt="">
            </div>
            <!-- _formatDate() 转化时间戳函数 -->
            <div class="time">{{_formatDate(rating.rateTime)}}</div>
            <p class="text">
              <span
                class="iconfont hand"
                :class="{'highlight': rating.rateType === 1, 'gray': rating.rateType === 2}"
              >{{rating.rateType === 1 ? '&#xe62a;' : '&#xe600;'}}</span>{{rating.text}}
            </p>
          </div>
          <!-- 详尽评论内容区块 -->
          <div class="complex"
               v-if="modeType === 'complex' ? true : false"
          >
            <div class="avatar">
              <img :src="rating.avatar" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :score="rating.score"></star>
                <span class="score">{{rating.score}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <span
                  class="iconfont hand"
                  :class="{'highlight': rating.rateType === 1, 'gray': rating.rateType === 2}"
                >{{rating.rateType === 1 ? '&#xe62a;' : '&#xe600;'}}</span>
                <span class="item border"
                      v-for="(item, index) in rating.recommend"
                      :key="index"
                >{{item}}</span>
              </div>
              <div class="time">{{_formatDate(rating.rateTime)}}</div>
            </div>
          </div>
        </li>
      </ul>
      <!--没有内容-->
      <div class="no-rating" v-show="!ratings || !ratings.length">该商品暂无评论</div>
    </div>
  </div>
</template>

<script>
/* 导入js模块化方法 */
import {formatDate} from 'js/date'
/* 导入星星评分组件 */
import star from 'components/common/star/star'

// 选择类型
const All = 0 // 所有评价
const Positive = 1 // 好评
const Negative = 2 // 差评

export default {
  name: 'ratingCheck',
  props: {
    ratings: { // 外部传入的评论数据
      type: Array
    },
    onlyContent: { // 只看有内容的评价
      type: Boolean,
      default: true
    },
    selectType: { // 当前已选择的类型
      type: Number,
      default: All // 0 All，1 positive，2 negative
    },
    typeDesc: { // 类型名称
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    modeType: { // 显示简洁或详尽评论内容区块阀值
      type: String,
      default: 'simple' // 默认显示简洁评论内容区块（'simple' or 'complex'）
    }
  },
  components: {
    star
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => { // 数组过滤（该商品所有好评数组集合）
        return rating.rateType === Positive
      })
    },
    negatives () {
      return this.ratings.filter((rating) => { // 数组过滤（该商品所有差评数组集合）
        return rating.rateType === Negative
      })
    }
  },
  data () {
    return {
      // 因为不能直接修改props所以用 data 接收（亦可用computed）
      checkContent: this.onlyContent, // 只看内容
      currentType: this.selectType // 评论类型
    }
  },
  methods: {
    // 初始化评论组件的评论类型和只看有内容的评价（值）
    initRating (onlyContent, type) {
      this.checkContent = onlyContent // 只看内容
      this.currentType = type // 评论类型
    },
    _selectType (type) { // 切换评论类型
      this.currentType = type // currentType值改变选项高亮跟着变
      this.$emit('scroll-refresh') // 触发自定义事件 scroll-refresh，使父组件的 BScroll 刷新
    },
    _checkContent () { // 切换只看有内容的评价
      this.checkContent = !this.checkContent
      this.$emit('scroll-refresh') // 触发自定义事件 scroll-refresh，使父组件的 BScroll 刷新
    },
    // 根据筛选条件显示评论
    _needShow (type, text) { // 遍历时传入每条评论的类型（type）和文本（text）用作显示判断
      if (this.checkContent && !text) { // 如果勾选只看有内容的评价，但内容为空则不显示该条评价
        return false
      }
      if (this.currentType === All || this.currentType === type) { // this.currentType === All 全部评论可见
        return true
      }
    },
    // 转换时间戳（毫秒）
    _formatDate (time) {
      let date = new Date(time) // 把时间戳（毫秒）转换为data类型对象
      // yyyy-MM-dd  yyyy-MM-dd hh:mm  yyyy-MM-dd hh:mm:ss （连接符可以更改不影响）
      return formatDate(date, 'yyyy-MM-dd hh:mm') // js模块化方法
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "iconfont/iconfont.css"
  .rating-type
    padding: .36rem 0
    margin: 0 .36rem
    font-size: 0
    &::before
      border-bottom-color: rgba(7,17,27,.1)
    .item
      display: inline-block
      padding: .16rem .24rem
      margin-right: .16rem
      line-height: .32rem
      border-radius: .04rem
      font-size: .24rem
      color: #4d555d
      &:last-child
        margin-right: 0
      &.positive
        background-color: rgba(0,160,220,.2)
        &.active
          color: #fff
          background-color: #00a0dc
      &.negative
        background-color: rgba(77,85,93,.2)
        &.active
          color: #fff
          background-color: #4d555d
      .count
        margin-left: .04rem;
        font-size: .16rem;
        font-style: normal
  .switch
    padding: .24rem .36rem
    font-size: 0
    line-height: .4rem
    color: #93999f
    &.on
      .check-circle
        color: #00c850
    &::before
      border-bottom-color: rgba(7,17,27,.3)
    .check-circle
      position: relative
      top: .04rem
      display: inline-block
      margin-right: .08rem
      font-size: .4rem
    .text
      font-size: .24rem
  .rating-wrapper
    padding: 0 .36rem
    .rating-item
      padding: .32rem 0
      position: relative
      &::before
        border-bottom-color: rgba(7,17,27,.2)
      .simple /* 简洁评论内容区块 */
        .time
          margin-bottom: .12rem
          line-height: .24rem
          font-size: .2rem
          color: #93999f
        .user
          position: absolute
          right: 0
          top: .32rem
          line-height: .24rem
          font-size: 0
          .name
            display: inline-block
            margin-right: .12rem
            vertical-align: top
            font-size: .2rem
            color: #93999f
          .avatar
            display: inline-block
            width: .24rem
            height: .24rem
            object-fit: cover
            border-radius: 50%
        .text
          line-height: .32rem
          font-size: .24rem
          color: #07111b
          .hand
            margin-right: .08rem
            line-height: .32rem
            font-size: .24rem
            &.highlight
              color: #00a0dc
            &.gray
              color: #93999f
      .complex /* 详尽评论内容区块 */
        display: flex
        .avatar
          flex: 0 0 .56rem
          width: .56rem
          margin-right: .24rem
          font-size: 0
          img
            display: inline-block
            width: .56rem
            height: .56rem
            object-fit: cover
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: .08rem
            line-height: .24rem
            font-size: .2rem
            color: #07111b
          .star-wrapper
            margin-bottom: .12rem
            font-size: 0
            .score
              display: inline-block
              margin-left: .1rem
              font-size: .2rem
              color: #f90
          .text
            margin-bottom: .16rem
            line-height: .36rem
            color: #07111b
            font-size: .24rem
          .recommend
            font-size: 0
            .hand
              margin-right: .08rem
              line-height: .32rem
              font-size: .24rem
              &.highlight
                color: #00a0dc
              &.gray
                color: #93999f
            .item
              display: inline-block
              padding: 0 .12rem
              margin: 0 .16rem .08rem 0
              border-radius: .04rem
              font-size: .2rem
              line-height: .36rem
              color: #93999f
              background: #fff
              &::before
                border-color: rgba(7, 17, 27, .1)
          .time
            position: absolute
            top: 0
            right: 0
            line-height: .24rem
            font-size: .2rem
            color: #93999f
    .no-rating
      padding: .36rem 0
      font-size: .24rem
      text-align: center
      color: #07111b
</style>
