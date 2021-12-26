import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home.vue'
import QuizForm from '@/components/quiz/form.vue'
import QuizQuestion from '@/components/quiz/question.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/quiz/form', name: 'quiz-form', component: QuizForm },
  {
    path: '/quiz/question/:id',
    name: 'quiz-question',
    component: QuizQuestion,
    meta: {
      quizStarted: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.quizStarted)) {
    if (!store.getters.quizStarted) {
      next({
        name: 'quiz-form'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
