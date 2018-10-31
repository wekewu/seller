<template>
  <!--starType 星星尺寸大小-->
  <div class="star" :class="starType">
    <span
      class="star-item"
      :key="index"
      v-for="(starClass, index) in starClasses"
      :class="starClass"></span>
  </div>
</template>

<script>
const LENGTH = 5 // 总星数
const ON = 'on' // 满星类名
const HALF = 'half' // 半星类名
const OFF = 'off' // 没有星类名
export default {
  name: 'star',
  /* 调用Star组件时给组件传递两个值：star尺寸，评分 */
  props: {
    // 尺寸大小
    size: {
      type: Number,
      default: 24
    },
    // 评分
    score: {
      type: Number,
      default: 0 // 默认没有任何星星
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size
    },
    starClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2 // 4.3 输出四颗星，4.5输出四颗半星
      let hasDecimal = score % 1 !== 0 // 判断是否有小数，如果有加半颗星
      let integer = Math.floor(score) // 判断有多少颗满星
      for (let i = 0; i < integer; i++) { // 先输出满星
        result.push(ON)
      }
      if (hasDecimal) { // 有小数加半颗星
        result.push(HALF)
      }
      while (result.length < LENGTH) { // 不够五颗星长度的用灰色星凑足五颗
        result.push(OFF)
      }
      return result // 返回一个star class 数组
    }
  }
}
/* star组件抽象 https://coding.imooc.com/lesson/74.html#mid=1628 */
</script>

<style lang="stylus" scoped>
  @import "~styles/mixin"
  .star
    display: inline-block
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
      background-position: center
      background-size: contain
    &.star-24
      .star-item
        width: .2rem
        height: .2rem
        margin-right: .06rem
        &:last-child
          margin-right: 0
        &.on
          bgImg('images/star24_on')
        &.star-item.half
          bgImg('images/star24_half')
        &.star-item.off
          bgImg('images/star24_off')
    &.star-36
      .star-item
        width: .3rem
        height: .3rem
        margin-right: .12rem
        &:last-child
          margin-right: 0
        &.on
          bgImg('images/star36_on')
        &.half
          bgImg('images/star36_half')
        &.off
          bgImg('images/star36_off')
    &.star-48
      .star-item
        width: .4rem
        height: .4rem
        margin-right: .44rem
        &:last-child
          margin-right: 0
        &.on
          bgImg('images/star48_on')
        &.half
          bgImg('images/star48_half')
        &.off
          bgImg('images/star48_off')
</style>
