import Vue from 'vue'
import Router from 'vue-router'
import PageHeader from 'components/PageHeader/header'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'head',
      component: PageHeader
    }
  ]
})
