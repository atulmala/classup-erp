import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Dashboard from '../components/Dashboard'
import StudentSearch from '../components/StudentSearch'
import FeePayment from '../components/FeePayment'
import Correction from '../components/Correction'
import AddStudent from '../components/AddStudent'

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
    },
    {
      path: '/student_search',
      name: 'StudentSearch',
      component: StudentSearch
    },
    {
      path: '/fee_payment',
      name: 'FeePayment',
      component: FeePayment
    },
    {
      path: '/correction',
      name: 'Coprrection',
      component: Correction
    },
    {
      path: '/add_student',
      name: 'add_student',
      component: AddStudent
    }
  ]
})
