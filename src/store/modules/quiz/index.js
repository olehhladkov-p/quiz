import {
  SET_PROCESSING,
  SET_QUIZ_STARTED,
  SET_CATEGORY_ID,
  GET_CATEGORIES,
  SET_DIFFICULTY_LEVEL,
  GET_QUESTIONS,
  SET_QUESTIONS_AMOUNT,
  GET_MAX_QUESTIONS_AMOUNT,
  INCREASE_CORRECT_ANSWERS_AMOUNT,
  INCREASE_INCORRECT_ANSWERS_AMOUNT
} from '@/store/constants'

import { replaceUrlParams } from '@/utils'

export default {
  state: {
    quizStarted: false,
    categoryId: '',
    categories: [],
    difficultyLevel: '',
    difficultyLevelList: ['Easy', 'Medium', 'Hard'],
    questions: [],
    questionsAmount: null,
    maxQuestionsAmount: null,
    answers: {
      correct: null,
      incorrect: null
    }
  },

  getters: {
    quizStarted: ({ quizStarted }) => quizStarted,
    categoryId: ({ categoryId }) => categoryId,
    categories: ({ categories }) => categories,
    difficultyLevel: ({ difficultyLevel }) => difficultyLevel,
    difficultyLevelList: ({ difficultyLevelList }) => difficultyLevelList,
    questions: ({ questions }) => questions,
    questionsAmount: ({ questionsAmount }) => questionsAmount,
    maxQuestionsAmount: ({ maxQuestionsAmount }) => maxQuestionsAmount,
    answersTotal: ({ answers: { correct, incorrect } }) => correct + incorrect,
    answersCorrect: ({ answers: { correct } }) => correct,
    answersIncorrect: ({ answers: { incorrect } }) => incorrect
  },

  mutations: {
    [SET_QUIZ_STARTED](state) {
      state.quizStarted = true
    },
    [SET_CATEGORY_ID](state, payload) {
      state.categoryId = payload
    },
    [GET_CATEGORIES](state, payload) {
      state.categories = payload
    },
    [SET_DIFFICULTY_LEVEL](state, payload) {
      state.difficultyLevel = payload
    },
    [GET_QUESTIONS](state, payload) {
      state.questions = payload
    },
    [SET_QUESTIONS_AMOUNT](state, payload) {
      state.questionsAmount = payload
    },
    [GET_MAX_QUESTIONS_AMOUNT](state, payload) {
      state.maxQuestionsAmount = payload
    },
    [INCREASE_CORRECT_ANSWERS_AMOUNT](state) {
      state.answers.correct += 1
    },
    [INCREASE_INCORRECT_ANSWERS_AMOUNT](state) {
      state.answers.incorrect += 1
    }
  },

  actions: {
    startQuiz({ dispatch, commit }) {
      return new Promise(resolve => {
        dispatch('getQuestions').then(() => {
          commit(SET_QUIZ_STARTED)
          resolve()
        })
      })
    },
    setCategoryId({ commit }, payload) {
      commit(SET_CATEGORY_ID, payload)
    },
    getCategories({ commit }) {
      commit(SET_PROCESSING, true, { root: true })

      return new Promise(resolve => {
        return fetch(process.env.VUE_APP_QUIZ_CATEGORIES_URL)
          .then(response => response.json())
          .then(({ trivia_categories }) => {
            commit(GET_CATEGORIES, trivia_categories)
            resolve()
          })
          .finally(() => commit(SET_PROCESSING, false, { root: true }))
      })
    },
    setDifficultyLevel({ commit }, payload) {
      commit(SET_DIFFICULTY_LEVEL, payload)
    },
    getQuestions({ commit, getters }) {
      commit(SET_PROCESSING, true, { root: true })

      return new Promise(resolve => {
        const url = replaceUrlParams(
          process.env.VUE_APP_QUIZ_QUESTIONS_URL,
          getters
        )

        return fetch(url)
          .then(response => response.json())
          .then(({ results: questions }) => {
            commit(GET_QUESTIONS, questions)
            resolve()
          })
          .finally(() => commit(SET_PROCESSING, false, { root: true }))
      })
    },
    setQuestionsAmount({ commit }, payload) {
      commit(SET_QUESTIONS_AMOUNT, payload)
    },
    getMaxQuestionsAmount({ commit, getters }) {
      commit(SET_PROCESSING, true, { root: true })

      return new Promise(resolve => {
        const { difficultyLevel } = getters
        const url = replaceUrlParams(
          process.env.VUE_APP_QUIZ_CATEGORY_QUESTIONS_COUNT_URL,
          getters
        )

        return fetch(url)
          .then(response => response.json())
          .then(data => {
            const questionsAmount =
              data.category_question_count[
                `total_${difficultyLevel.toLowerCase()}_question_count`
              ]
            commit(GET_MAX_QUESTIONS_AMOUNT, questionsAmount)
            resolve()
          })
          .finally(() => commit(SET_PROCESSING, false, { root: true }))
      })
    }
  }
}
