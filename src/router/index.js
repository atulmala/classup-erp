import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Dashboard from '../components/Dashboard'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})
