<template>
  <div>
    <h1 class="text-center">Setup your quiz!</h1>
    <div class="quiz-form-wrapper">
      <form
        @change="onFormChange"
        @submit.prevent="onFormSubmit"
        class="quiz-form"
      >
        <p class="quiz-form-note">
          <span v-show="processing"> Fetching form data... </span>
        </p>

        <select
          v-model="category"
          :disabled="processing || !categories.length"
          name="category"
          required
        >
          <option value="" disabled>
            {{ categories.length ? 'Select a category' : loadingPlaceholder }}
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="difficulty"
          :disabled="processing || !category"
          name="difficulty"
          required
        >
          <option value="" disabled>Select a category difficulty</option>
          <option
            v-for="level in difficultyLevelList"
            :key="level"
            :value="level"
          >
            {{ level }}
          </option>
        </select>

        <input
          v-model="questionsTotal"
          :disabled="processing || !difficulty"
          :max="maxQuestionsAmount"
          name="questions_total"
          placeholder="Select a number of questions"
          type="number"
          min="1"
          required
        />

        <button class="btn" :disabled="isFormDisabled">Start a quiz</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loadingPlaceholder: 'Loading categories...'
    }
  },
  created() {
    if (!this.categories.length) {
      this.getCategories()
    }
  },
  computed: {
    ...mapGetters([
      'processing',
      'step',
      'categoryId',
      'categories',
      'difficultyLevel',
      'difficultyLevelList',
      'questionsAmount',
      'maxQuestionsAmount'
    ]),
    isFormDisabled() {
      return !this.category || !this.difficulty || !this.questionsTotal
    },
    category: {
      get() {
        return this.categoryId
      },
      set(value) {
        this.setCategoryId(value)
      }
    },
    difficulty: {
      get() {
        return this.difficultyLevel
      },
      set(value) {
        this.setDifficultyLevel(value)
      }
    },
    questionsTotal: {
      get() {
        return this.questionsAmount
      },
      set(value) {
        return this.setQuestionsAmount(Number(value))
      }
    }
  },
  methods: {
    ...mapActions([
      'startQuiz',
      'setCategoryId',
      'getCategories',
      'setDifficultyLevel',
      'setQuestionsAmount',
      'getMaxQuestionsAmount'
    ]),
    onFormChange(e) {
      const targetName = e.target.name

      if (
        this.category &&
        this.difficulty &&
        targetName !== 'questions_total'
      ) {
        this.getMaxQuestionsAmount()
      }
    },
    onFormSubmit() {
      this.startQuiz().then(() => {
        this.$router.push({ name: 'quiz-question', params: { questionId: this.step } })
      })
    }
  }
}
</script>

<style scoped>
.quiz-form-wrapper {
  display: flex;
  justify-content: center;
  max-width: 30rem; /* 480px */
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.quiz-form {
  position: relative;
  width: 100%;
  padding: 2.5rem 3rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid #999;
}

.quiz-form-note {
  position: absolute;
  top: 1rem;
  margin: 0;
  color: #999;
}

.quiz-form select:disabled,
.quiz-form input:disabled {
  opacity: 0.7;
}

.quiz-form select,
.quiz-form input,
.quiz-form .btn {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  width: 100%;
  line-height: normal;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: #fff;
}

.quiz-form .btn {
  font-size: 1.125rem;
  cursor: pointer;
}

.quiz-form .btn:not([disabled]):hover {
  background-color: #eee;
}

.quiz-form .btn[disabled] {
  cursor: not-allowed;
}
</style>
