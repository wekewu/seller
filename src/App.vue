<template>
  <div id="app">
    <page-header :seller="seller"></page-header>
    <div class="tab border-bottom">
      <router-link class="tab-item" to="/goods" tag="div">商品</router-link>
      <router-link class="tab-item" to="/ratings" tag="div">评论</router-link>
      <router-link class="tab-item" to="/seller" tag="div">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"/>
    </keep-alive>
  </div>
</template>

<script>
import PageHeader from 'components/pages/PageHeader/header'
import axios from 'axios'

// 请求状态码赋值给常量好处：语义化，如果后期变更状态码值只需改动一处。
const ERRNO_OK = 0

export default {
  name: 'App',
  components: {
    PageHeader
  },
  data () {
    return {
      seller: {}
    }
  },
  methods: {
    getHeaderData () {
      axios.get('/api/seller').then(this.getHeaderSucc).catch(this.getHeaderErr)
    },
    getHeaderSucc (res) {
      const result = res.data
      if (result.errno === ERRNO_OK && result.data) {
        this.seller = result.data
      }
    },
    getHeaderErr (error) {
      console.log(error)
    }
  },
  mounted () {
    this.getHeaderData()
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
