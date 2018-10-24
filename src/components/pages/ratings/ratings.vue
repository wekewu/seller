<template>
  <!--调用scroll组件实现滚动列表需求-->
  <!--:pullup="pullup" 下拉加载阀值
      @scrollToEnd="loadData" 下拉加载执行函数-->
  <div class="ratings">
    <scroll
      :data="data"
      :pullup="pullup"
      @scrollToEnd="loadData"
      :pulldown="pulldown"
      @pulldown="refreshData"
    >
      <ul class="content">
        <li v-for="(item, index) in data" :key="index">
          <div>
            <img :src="item.avatar" width="100px" height="100px" alt="">
          </div>
          <span>{{item.username}}</span>
          <p>{{item.text}}</p>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
// import scroll from 'components/common/BScroll/scroll'已被注册为全局组件不用单独引入
import axios from 'axios'
export default {
  name: 'ratings',
  /* components: {
    scroll
  }, */
  data () {
    return {
      data: [],
      pullup: true, // 开启上拉加载
      pulldown: true // 开启下拉刷新
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData () {
      axios.get('/api/ratings').then((res) => {
        const result = res.data
        if (result.errno === 0 && result.data) {
          console.log('上拉加载数据')
          this.data = result.data.concat(this.data)
        }
      })
    },
    // 刷新数据
    refreshData () {
      axios.get('/api/ratings').then((res) => {
        const result = res.data
        if (result.errno === 0 && result.data) {
          console.log('下拉加载数据')
          this.data = result.data
        }
      })
    }
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
</style>
