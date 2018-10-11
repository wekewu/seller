<template>
  <div class="counter">
    <!-- 数量为0时，不显示减少、数量元素 -->
    <transition name="move">
      <div class="minus_count iconfont"
           v-show="pro.count > 0"
           @click="minusCount"
      >&#xe652;</div>
    </transition>
    <div class="count" v-show="pro.count > 0">{{pro.count}}</div>
    <div class="add_count iconfont" @click="addCount">&#xe616;</div>
  </div>
</template>

<script>
export default {
  name: 'counter',
  props: {
    pro: { // 调用 counter 组件时把商品数据传递进来
      type: Object
    }
  },
  methods: {
    // 计数器数量加1
    addCount () {
      if (!this.pro.count) { // 如果 pro.count（数量） 不存在，赋值为1
        this.$set(this.pro, 'count', 1)
      } else {
        this.pro.count++
      }
    },
    // 计数器数量减1
    minusCount () {
      if (this.pro.count > 0) {
        this.pro.count--
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "iconfont/iconfont.css"
  .counter
    font-size: 0
    .minus_count, .add_count
      position: relative
      display: inline-block
      line-height: .48rem
      font-size: .48rem
      color: #00a0dc
      &:after
        content: ''
        position: absolute
        top: -.12rem
        right: -.12rem
        bottom: -.12rem
        left: -.12rem
    .minus_count
      opacity: 1
      transform: translate3D(0, 0, 0) rotate(0)
      transition: all .4s linear
      &.move-enter,&.move-leave-active /* 动画状态效果 */
        opacity: 0
        transform: translate3D(24px, 0, 0) rotate(360deg)
    .count
      display: inline-block
      vertical-align: top
      line-height: .48rem
      width: .48rem
      text-align: center
      font-size: .2rem
      color: #93999f
</style>
