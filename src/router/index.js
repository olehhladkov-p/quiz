import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home.vue'
import QuizForm from '@/components/quiz/form.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/quiz-form', name: 'quiz-form', component: QuizForm }
]

export default new VueRouter({
  routes
})
