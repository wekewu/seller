// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import 'styles/global_css.styl' // .styl后缀不能省略
import scroll from 'components/common/BScroll/scroll' // 导入 scroll 组件

Vue.config.productionTip = false
fastClick.attach(document.body)
Vue.component('scroll', scroll) // 把 scroll 组件注册为全局组件

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  /* components: { App },
  template: '<App/>' */
  render: h => h(App)
})
