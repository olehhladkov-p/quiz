<template>
  <div class="quiz-list">
    <!-- TODO: replace v-html directive. Uses because of quotes interpolation -->
    <h1 class="text-center" v-html="question.question"></h1>

    <div class="quiz-item">
      <div class="quiz-answers-list">
        <div
          v-for="answer in question.answers"
          :key="answer"
          class="quiz-answer"
        >
          <label>
            <input
              @change="onChange"
              :value="answer"
              type="radio"
              name="quiz-answer"
            />
            {{ answer }}
          </label>
        </div>
      </div>

      <button type="button" :disabled="processing || !answer">Next</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {},
  data() {
    return {
      answer: null
    }
  },
  computed: {
    ...mapGetters(['processing', 'question'])
  },
  methods: {
    onChange(e) {
      this.answer = e.target.value
    }
  }
}
</script>

<style scoped>
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
