<template>
  <div>
    <h1 class="text-center">Quiz results</h1>

    <div class="quiz-results">
      <div class="mb-1">
        You answered <mark>{{ correctAnswersAmount }}</mark> question(s)
        correctly!
      </div>

      <button @click.prevent="restartQuiz" type="button">Start new quiz</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['correctAnswersAmount'])
  },
  methods: {
    ...mapActions(['resetQuiz']),
    restartQuiz() {
      this.resetQuiz().then(() => this.$router.push({ name: 'quiz-form' }))
    }
  }
}
</script>

<style scoped>
.quiz-results {
  max-width: 30rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 3rem;
  text-align: center;
  border-radius: 1rem;
  border: 1px solid #999;
}
</style>
