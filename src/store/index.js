import Vue from 'vue'
import Vuex from 'vuex'
import quiz from './modules/quiz/'

import { SET_PROCESSING } from './constants'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    quiz
  },
  state: {
    processing: false
  },
  mutations: {
    [SET_PROCESSING](state, payload) {
      state.processing = payload
    }
  },
  getters: {
    processing: ({ processing }) => processing
  }
})
