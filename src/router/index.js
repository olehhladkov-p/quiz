import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home.vue'
import QuizForm from '@/components/quiz/form.vue'
import QuizQuestionsList from '@/components/quiz/questions-list.vue'
import NotFound from '@/components/not-found.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/quiz/form', name: 'quiz-form', component: QuizForm },
  {
    path: '/quiz/question/:questionId',
    name: 'quiz-question',
    component: QuizQuestionsList,
    meta: {
      quizStarted: true
    }
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const { quizStarted, answers } = store.getters
  const answersAmount = Object.keys(answers).length + 1 || 1

  if (to.matched.some(record => record.meta.quizStarted)) {
    if (!quizStarted) {
      next({
        name: 'quiz-form'
      })
    } else if (
      to.params.questionId < 1 ||
      to.params.questionId > answersAmount
    ) {
      next({
        name: 'quiz-question',
        params: {
          questionId: answersAmount
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
