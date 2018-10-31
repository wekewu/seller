<template>
  <div class="split border-topbottom"></div>
</template>

<script>
export default {
  name: 'split'
}
</script>

<style lang="stylus" scoped>
  .split
    width: 100%
    height: .32rem
    background-color: #f3f5f7
    &.border-topbottom::before, &.border-topbottom::after
      border-color: rgba(7,17,27,.2)
</style>
