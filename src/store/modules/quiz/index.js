import { QUIZ_STATE } from '@/constants'

import {
  SET_PROCESSING,
  SET_QUIZ_STARTED,
  GO_TO_STEP,
  SET_CATEGORY_ID,
  GET_CATEGORIES,
  SET_DIFFICULTY_LEVEL,
  GET_QUESTIONS,
  SET_QUESTIONS_AMOUNT,
  GET_MAX_QUESTIONS_AMOUNT,
  SET_ANSWER,
  RESET_QUIZ
} from '@/store/constants'

import { replaceUrlParams, saveToStorage, getFromStorage } from '@/utils'

const initialState = {
  quizStarted: false,
  step: 1,
  categoryId: '',
  categories: [],
  difficultyLevel: '',
  difficultyLevelList: ['Easy', 'Medium', 'Hard'],
  questions: [],
  questionsAmount: null,
  maxQuestionsAmount: null,
  answers: {}
}

export default {
  state: getFromStorage(QUIZ_STATE) ?? Object.assign({}, initialState),

  getters: {
    quizStarted: ({ quizStarted }) => quizStarted,
    step: ({ step }) => step,
    isFirstStep: ({ step }) => step === 1,
    isLastStep: ({ step, questions }) => step === questions.length,
    categoryId: ({ categoryId }) => categoryId,
    categories: ({ categories }) => categories,
    difficultyLevel: ({ difficultyLevel }) => difficultyLevel,
    difficultyLevelList: ({ difficultyLevelList }) => difficultyLevelList,
    questions: ({ questions }) => questions,
    questionsAmount: ({ questionsAmount }) => questionsAmount,
    maxQuestionsAmount: ({ maxQuestionsAmount }) => maxQuestionsAmount,
    answers: ({ answers }) => answers
  },

  mutations: {
    [SET_QUIZ_STARTED](state) {
      state.quizStarted = true
    },
    [GO_TO_STEP](state, payload) {
      state.step = payload
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
    [SET_ANSWER](state, payload) {
      state.answers[payload.questionId] = payload.answer
    },
    [RESET_QUIZ](state) {
      Object.keys(state).forEach(key => {
        state[key] = initialState[key]
      })

      // TODO(inexplicably): initialState['answers']` updated with store state. Delete answers manually
      state.answers = {}
    }
  },

  actions: {
    startQuiz(store) {
      return new Promise(resolve => {
        store.dispatch('getQuestions').then(() => {
          store.commit(SET_QUIZ_STARTED)
          saveToStorage(QUIZ_STATE, store.state)
          resolve()
        })
      })
    },
    goToStep(store, payload) {
      store.commit(GO_TO_STEP, payload)
      saveToStorage(QUIZ_STATE, store.state)
    },
    setCategoryId({ commit }, payload) {
      commit(SET_CATEGORY_ID, payload)
    },
    getCategories(store) {
      store.commit(SET_PROCESSING, true, { root: true })

      return new Promise(resolve => {
        return fetch(process.env.VUE_APP_QUIZ_CATEGORIES_URL)
          .then(response => response.json())
          .then(({ trivia_categories }) => {
            store.commit(GET_CATEGORIES, trivia_categories)
            saveToStorage(QUIZ_STATE, store.state)
            resolve()
          })
          .finally(() => store.commit(SET_PROCESSING, false, { root: true }))
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
          .then(({ results }) => {
            const questions = results.map(item => {
              const answers = [item.correct_answer, ...item.incorrect_answers]

              return {
                ...item,
                answers
              }
            })

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
    },
    setAnswer(store, payload) {
      store.commit(SET_ANSWER, payload)
    },
    resetQuiz(store) {
      return new Promise(resolve => {
        store.commit(RESET_QUIZ)
        saveToStorage(QUIZ_STATE, initialState)
        resolve()
      })
    }
  }
}
