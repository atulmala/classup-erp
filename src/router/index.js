import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Dashboard from '../components/Common/Dashboard'
import StudentSearch from '../components/Common/StudentSearch'
import FeePayment from '../components/Fee/FeePayment'
import Correction from '../components/Fee/Correction'
import AddStudent from '../components/Student/AddStudent'
import UpdateStudent from '../components/Student/UpdateStudent'
import ClassSearch from '../components/Exams/ClassSearch'
import PerformanceAnalysis from '../components/Exams/PerformanceAnalysis'

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
    },
    {
      path: '/update_student',
      name: 'update_student',
      component: UpdateStudent
    },
    {
      path: '/class_search',
      name: 'class_search',
      component: ClassSearch
    },
    {
      path: '/performance_analysis',
      name: 'performance_analysis',
      component: PerformanceAnalysis
    }
  ]
})
