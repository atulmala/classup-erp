import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    // server_ip: 'http://localhost:8000',
    server_ip: 'https://www.classupclient.com',
    logged_status: false,
    logged_user: 'unknown',
    user_name: 'unknown',
    user_type: 'unknown',
    school_id: 0,
    student_id: 'unknown',
    student_name: 'unknown',
    student_class: 'unknown',
    parent: 'unknown',
    school_name: 'ClassUp',
    coming_from: 'unknown',
    adm_fee: false,

    // 01/12/2019 - for marks entry component
    the_class: 'unknown',
    section: 'unknown',
    subject: 'unknown',
    exam: 'unknown',
    test: 'unknown',
    grade_based: 'unknown',
    test_type: 'unknown',
    max_marks: 'unknown'
  },
  mutations: {
    SET_LOGGED_STATUS(state, status) {
      state.logged_status = status;
    },
    SET_USER(state, user) {
      state.logged_user = user;
    },
    SET_USER_NAME(state, user_name) {
      state.user_name = user_name;
    },
    SET_USER_TYPE(state, user_type) {
      state.user_type = user_type;
    },
    SET_ID(state, id) {
      state.school_id = id;
    },
    SET_SCHOOL_NAME(state, school_name) {
      state.school_name = school_name;
    },
    SET_STUDENT_ID(state, id) {
      state.student_id = id;
    },
    SET_STUDENT_NAME(state, name) {
      state.student_name = name;
    },
    SET_STUDENT_CLASS(state, the_class) {
      state.student_class = the_class;
    },
    SET_PARENT(state, parent) {
      state.parent = parent;
    },
    SET_ADM_FEE(state, status) {
      state.adm_fee = status;
    },
    SET_COMING_STATUS(state, coming_from) {
      state.coming_from = coming_from;
    },
    SET_CLASS(state, the_class) {
      state.the_class = the_class;
    },
    SET_SECTION(state, section) {
      state.section = section;
    },
    SET_SUBJECT(state, subject) {
      state.subject = subject;
    },
    SET_EXAM(state, exam) {
      state.exam = exam;
    },
    SET_TEST(state, test) {
      state.test = test;
    },
    SET_GRADE_BASED(state, grade_based) {
      state.test_type = grade_based;
    },
    SET_TEST_TYPE(state, test_type) {
      state.test_type = test_type;
    },
    SET_MAX_MARKS(state, max_marks) {
      state.max_marks = max_marks;
    }
  },
  actions: {
    set_logged_status(context, status) {
      context.commit('SET_LOGGED_STATUS', status)
    },
    set_user(context, user) {
      context.commit('SET_USER', user)
    },
    set_user_name(context, user_name) {
      context.commit('SET_USER_NAME', user_name)
    },
    set_user_type(context, user_type) {
      context.commit('SET_USER_TYPE', user_type)
    },
    set_id(context, id) {
      context.commit('SET_ID', id)
    },
    set_school_name(context, school_name) {
      context.commit('SET_SCHOOL_NAME', school_name)
    },
    set_student_id(context, id) {
      context.commit('SET_STUDENT_ID', id)
    },
    set_student_name(context, name) {
      context.commit('SET_STUDENT_NAME', name)
    },
    set_student_class(context, the_class) {
      context.commit('SET_STUDENT_CLASS', the_class)
    },
    set_parent(context, parent) {
      context.commit('SET_PARENT', parent)
    },
    set_adm_fee(context, status) {
      context.commit('SET_ADM_FEE', status)
    },
    set_coming_status(context, coming_from) {
      context.commit('SET_COMING_STATUS', coming_from)
    },
    set_class(context, the_class) {
      context.commit('SET_CLASS', the_class)
    },
    set_section(context, section) {
      context.commit('SET_SECTION', section)
    },
    set_subject(context, subject) {
      context.commit('SET_SUBJECT', subject)
    },
    set_exam(context, exam) {
      context.commit('SET_EXAM', exam)
    },
    set_test(context, test) {
      context.commit('SET_TEST', test)
    },
    set_grade_based(context, grade_based) {
      context.commit('SET_GRADE_BASED', grade_based)
    },
    set_test_type(context, test_type) {
      context.commit('SET_TEST_TYPE', test_type)
    },
    set_max_marks(context, max_marks) {
      context.commit('SET_MAX_MARKS', max_marks);
    }
  },
  getters: {
    get_logged_status(state) {
      return state.logged_status
    },
    get_logged_user(state) {
      return state.logged_user
    },
    get_user_name(state) {
      return state.user_name
    },
    get_user_type(state) {
      return state.user_type
    },
    get_school_id(state) {
      return state.school_id
    },
    get_school_name(state) {
      return state.school_name
    },
    get_server_ip(state) {
      return state.server_ip
    },
    get_student_id(state) {
      return state.student_id
    },
    get_student_name(state) {
      return state.student_name
    },
    get_student_class(state) {
      return state.student_class
    },
    get_parent(state) {
      return state.parent
    },
    get_adm_fee(state) {
      return state.adm_fee
    },
    get_coming_from(state) {
      return state.coming_from
    },
    get_class(state) {
      return state.the_class
    },
    get_section(state) {
      return state.section
    },
    get_subject(state) {
      return state.subject
    },
    get_exam(state) {
      return state.exam
    },
    get_test(state) {
      return state.test
    },
    get_grade_based(state) {
      return state.grade_based;
    },
    get_test_type(state) {
      return state.test_type;
    },
    get_max_marks(state)  {
      return state.max_marks;
    }
  }
});
