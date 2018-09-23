import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/pages/goods/goods'
import ratings from 'components/pages/ratings/ratings'
import seller from 'components/pages/seller/seller'

Vue.use(Router)

/* const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}] */

export default new Router({
  linkActiveClass: 'active',
  // routes,
  routes: [{
    path: '/',
    // 重定向
    redirect: '/goods'
  }, {
    path: '/goods',
    component: goods
  }, {
    path: '/ratings',
    component: ratings
  }, {
    path: '/seller',
    component: seller
  }]
})
