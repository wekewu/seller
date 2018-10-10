<template>
  <!-- 值跟类名映射，类名决定显示哪张图片 -->
  <span class="icon" :class="[classMap[sub], sizeMap[size]]"></span>
</template>

<script>
export default {
  name: 'icons',
  props: {
    sub: { // sub 决定使用哪个类名（每个类名对应不同图标）
      type: Number
    },
    size: { // size 决定图标尺寸
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 用数组下标映射对应类名
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      sizeMap: ['icon1', 'icon2', 'icon3', 'icon4']
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixin"
  .icon
    display: inline-block
    vertical-align: top
    &.icon1
      margin-right: .08rem
      width: .24rem
      height: .24rem
      icon(1)
    &.icon2
      margin-right: .12rem
      vertical-align: sub
      width: .32rem
      height: .32rem
      icon(2)
    &.icon3
      margin-right: .04rem
      width: .24rem
      height: .24rem
      icon(3)
</style>
