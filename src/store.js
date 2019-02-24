import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    logged_status: false,
    logged_user: 'unknown',
    user_name: 'unknown',
    user_type: 'unknown',
    school_id: 0,
    school_name: 'ClassUp'
  },
  mutations: {
    SET_LOGGED_STATUS(state, status) {
      state.logged_status = status;
    },
    SET_USER(state, user) {
      state.logged_user = user
    },
    SET_USER_NAME(state, user_name) {
      state.user_name = user_name
    },
    SET_USER_TYPE(state, user_type) {
      state.user_type = user_type
    },
    SET_ID(state, id) {
      state.school_id = id
    },
    SET_SCHOOL_NAME(state, school_name) {
      state.school_name = school_name
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
    }

  },
  getters: {
    get_logged_status(state) {
      return state.logged_status
    },
    get_logged_user(state) {
      return state.logged_user
    },
    get_user_name(state)  {
      return state.user_name
    },
    get_user_type(state)  {
      return state.user_type
    },
    get_school_id(state) {
      return state.school_id
    },
    get_school_name(state) {
      return state.school_name
    }
  }
});

