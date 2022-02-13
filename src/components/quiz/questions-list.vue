<template>
  <div class="quiz-list">
    <!-- TODO: Do not use v-html directive. Uses because of interpolation -->
    <h1 class="text-center" v-html="currentQuestion.question"></h1>

    <div class="quiz-item">
      <div class="quiz-answers-list">
        <div
          v-for="answer in currentQuestion.answers"
          :key="answer"
          class="quiz-answer"
        >
          <label>
            <input
              @change="onChange"
              :value="answer"
              v-model="answers[questionId]"
              type="radio"
            />
            <!-- TODO: Do not use v-html directive. Uses because of interpolation -->
            <span v-html="answer"></span>
          </label>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <button @click.prevent="onBackClick" type="button">
          {{ isFirstStep ? 'Restart quiz' : 'Back' }}
        </button>
        <button
          @click.prevent="onNextClick"
          type="button"
          :disabled="processing || !answers[questionId]"
        >
          {{ isLastStep ? 'Finish quiz' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  watch: {
    $route(to) {
      this.goToStep(Number(to.params.questionId))
    }
  },
  computed: {
    ...mapGetters([
      'processing',
      'step',
      'isFirstStep',
      'isLastStep',
      'questions',
      'answers'
    ]),
    questionId() {
      return this.$route.params.questionId - 1
    },
    currentQuestion() {
      return this.questions[this.questionId] ?? {}
    }
  },
  methods: {
    ...mapActions(['goToStep', 'setAnswer', 'resetQuiz']),
    onChange(e) {
      this.setAnswer({ questionId: this.questionId, answer: e.target.value })
    },
    onNextClick() {
      if (this.isLastStep) {
        return
      }

      this.goToStep(this.step + 1)

      this.$router.push({
        name: this.$router.currentRoute.name,
        params: { questionId: this.step }
      })
    },
    onBackClick() {
      if (this.isFirstStep) {
        this.resetQuiz().then(() => this.$router.push({ name: 'quiz-form' }))

        return
      }

      this.goToStep(this.step - 1)

      this.$router.push({
        name: this.$router.currentRoute.name,
        params: { questionId: this.step }
      })
    }
  }
}
</script>

<style scoped>
.quiz-answers-list {
  margin-bottom: 1rem;
}

.quiz-item {
  position: relative;
  max-width: 30rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  border: 1px solid #999;
}
</style>
