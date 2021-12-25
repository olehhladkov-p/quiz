import {
  SET_PROCESSING,
  SET_QUIZ_STARTED,
  SET_CATEGORY_ID,
  SET_CATEGORIES,
  SET_DIFFICULTY_LEVEL,
  SET_QUESTIONS_AMOUNT,
  SET_MAX_QUESTIONS_AMOUNT,
  INCREASE_CORRECT_ANSWERS_AMOUNT,
  INCREASE_INCORRECT_ANSWERS_AMOUNT
} from '@/store/constants'

export default {
  state: {
    quizStarted: false,
    categoryId: '',
    categories: [],
    difficultyLevel: '',
    difficultyLevelList: ['easy', 'medium', 'hard'],
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
    [SET_CATEGORIES](state, payload) {
      state.categories = payload
    },
    [SET_DIFFICULTY_LEVEL](state, payload) {
      state.difficultyLevel = payload
    },
    [SET_QUESTIONS_AMOUNT](state, payload) {
      state.questionsAmount = payload
    },
    [SET_MAX_QUESTIONS_AMOUNT](state, payload) {
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
    setQuizStarted({ commit }) {
      commit(SET_QUIZ_STARTED)
    },
    setCategoryId({ commit }, payload) {
      commit(SET_CATEGORY_ID, payload)
    },
    async setCategories({ commit }) {
      commit(SET_PROCESSING, true, { root: true })

      try {
        const categories = await (
          await fetch(process.env.VUE_APP_QUIZ_CATEGORIES_URL)
        ).json()

        commit(SET_CATEGORIES, categories.trivia_categories)
      } catch (e) {
        console.error(e)
      } finally {
        commit(SET_PROCESSING, false, { root: true })
      }
    },
    setDifficultyLevel({ commit }, payload) {
      commit(SET_DIFFICULTY_LEVEL, payload)
    },
    setQuestionsAmount({ commit }, payload) {
      commit(SET_QUESTIONS_AMOUNT, payload)
    },
    async setMaxQuestionsAmount({ commit, getters }) {
      commit(SET_PROCESSING, true, { root: true })

      try {
        const { categoryId, difficultyLevel } = getters
        const url =
          process.env.VUE_APP_QUIZ_CATEGORY_QUESTIONS_COUNT_URL.replace(
            'CATEGORY_ID',
            categoryId
          )
        const data = await (await fetch(url)).json()
        const questionsAmount =
          data.category_question_count[
            `total_${difficultyLevel}_question_count`
          ]

        commit(SET_MAX_QUESTIONS_AMOUNT, questionsAmount)
      } catch (e) {
        console.error(e)
      } finally {
        commit(SET_PROCESSING, false, { root: true })
      }
    }
  }
}
