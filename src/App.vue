<template>
  <div id="app">
    <page-header></page-header>
    <div class="tab border-bottom">
      <router-link class="tab-item" to="/goods" tag="div">商品</router-link>
      <router-link class="tab-item" to="/ratings" tag="div">评论</router-link>
      <router-link class="tab-item" to="/seller" tag="div">商家</router-link>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import PageHeader from 'components/PageHeader/header'
export default {
  name: 'App',
  components: {
    PageHeader
  }
}
</script>

<style lang="stylus">
  .tab
    display: flex
    width: 100%
    height: .8rem
    line-height: .8rem
    &:before
      border-bottom-color: rgba(7, 17, 27, .1)
    .tab-item
      flex: 1
      text-align: center
      font-size: .28rem
      color: rgb(77, 85, 93)
      &.active
        color: rgb(240, 20, 20)
</style>
