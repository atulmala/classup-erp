import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Common/Dashboard'
import StudentSearch from '../components/Common/StudentSearch'
import FeePayment from '../components/Fee/FeePayment'
import Correction from '../components/Fee/Correction'
import AddStudent from '../components/Student/AddStudent'
import UpdateStudent from '../components/Student/UpdateStudent'
import DeleteStudent from '../components/Student/DeleteStudent'
import DownloadStudentList from '../components/Student/DownloadStudentList'
import ClassSearch from '../components/Exams/ClassSearch'
import PerformanceAnalysis from '../components/Exams/PerformanceAnalysis'
import Marksheet from '../components/Exams/Marksheet'
import BulkSMS from '../components/Communication/BulkSMS'
import ClassMonthlyAttendance from '../components/TeacherMenu/ClassMonthlyAttendance'
import ScheduleTest from '../components/Exams/ScheduleTest'
import ShowTestList from '../components/Exams/ShowTestList'
import MarksEntry from '../components/Exams/MarksEntry'
import ExamResults from '../components/Exams/ExamResults'
import StudentAttendance from '../components/Attendance/StudentAttendance'
import SendMessageToParents from '../components/TeacherMenu/SendMessageToParents'
import TeacherMessageHistory from '../components/TeacherMenu/TeacherMessageHistory'
import MonthlyCommunicationReport from '../components/Communication/MonthlyCommunicationReport'
import ParentCommunicationReport from '../components/Communication/ParentCommunicationReport'
import AddTeacher from '../components/TeacherManagement/AddTeacher'
import UpdateTeacher from '../components/TeacherManagement/UpdateTeacher'
import SetClassTeacher from '../components/TeacherManagement/SetClassTeacher'
import DeleteTeacher from '../components/TeacherManagement/DeleteTeacher'
import SetupTimetable from '../components/Timetable/SetupTimetable'
import TeacherAttendance from '../components/Timetable/TeacherAttendance'
import UnscheduledTestReport from '../components/Exams/UnscheduledTestReport.vue'
import DetainList from '../components/Exams/DetainList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/detain_list',
      name: 'DetainList',
      component: DetainList
    },
    {
      path: '/unscheduled_test_report',
      name: 'UnscheduledTestReport',
      component: UnscheduledTestReport
    },
    {
      path: '/teacher_attendance',
      name: 'TeacherAttendance',
      component: TeacherAttendance
    },
    {
      path: '/setup_time_table',
      name: 'SetupTimetable',
      component: SetupTimetable
    },
    {
      path: '/delete_teacher',
      name: 'DeleteTeacher',
      component: DeleteTeacher
    },
    {
      path: '/update_teacher',
      name: 'UpdateTeacher',
      component: UpdateTeacher
    },
    {
      path: '/set_class_teacher',
      name: 'SetClassTeacher',
      component: SetClassTeacher
    },
    {
      path: '/add_teacher',
      name: 'AddTeacher',
      component: AddTeacher
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
      path: '/delete_student',
      name: 'delete_student',
      component: DeleteStudent
    },
    {
      path: '/download_student_list',
      name: 'download_student_list',
      component: DownloadStudentList
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
    },
    {
      path: '/mark_sheet',
      name: 'mark_sheet',
      component: Marksheet
    },
    {
      path: '/exam_results',
      name: 'exam_results',
      component: ExamResults
    },
    {
      path: '/bulk_sms',
      name: 'bulk_sms',
      component: BulkSMS
    },
    {
      path: '/class_monthly_attendance',
      name: 'class_monthly_attendance',
      component: ClassMonthlyAttendance
    },
    {
      path: '/schedule_test',
      name: 'schedule_test',
      component: ScheduleTest
    },
    {
      path: '/show_test_list',
      name: 'show_test_list',
      component: ShowTestList
    },
    {
      path: '/marks_entry',
      name: 'marks_entry',
      component: MarksEntry
    },
    {
      path: '/student_attendance',
      name: 'student_attendance',
      component: StudentAttendance
    },
    {
      path: '/send_message_to_parents',
      name: 'send_message_to_parents',
      component: SendMessageToParents
    },
    {
      path: '/teacher_message_history',
      name: 'teacher_message_history',
      component: TeacherMessageHistory
    },
    {
      path: '/monthly_communication',
      name: 'monthly_communication',
      component: MonthlyCommunicationReport
    },
    {
      path: '/parent_communication',
      name: 'parent_communication',
      component: ParentCommunicationReport
    }
  ]
})
