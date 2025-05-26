<template>
  <div class="container mx-auto px-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ t("quiz.daily") }}
        </h1>
        <div class="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Score: {{ score }}/{{ totalPossibleScore }}
        </div>
      </div>

      <div v-if="!isCompleted" class="space-y-6">
        <div v-if="currentCard" class="space-y-6">
          <CardDisplay :card="currentCard" />

          <!-- Field Inputs -->
          <div class="space-y-4">
            <div
              v-for="field in currentFields"
              :key="field.name"
              class="space-y-2"
            >
              <label
                :for="field.name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {{ t(`quiz.fields.${field.name}`) }}
              </label>
              <div class="flex gap-2">
                <input
                  :id="field.name"
                  v-model="fieldAnswers[field.name]"
                  type="text"
                  :placeholder="t(`quiz.fields.${field.name}Placeholder`)"
                  :disabled="field.isAnswered"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  @keyup.enter="handleSubmit(field.name)"
                />
                <button
                  v-if="!field.isAnswered"
                  class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  @click="handleSubmit(field.name)"
                >
                  {{ t("quiz.submit") }}
                </button>
                <div
                  v-else
                  class="px-4 py-2 rounded-md flex items-center"
                  :class="
                    field.isCorrect
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  "
                >
                  <Icon
                    :name="field.isCorrect ? 'ph:check-bold' : 'ph:x-bold'"
                    class="w-5 h-5 mr-2"
                  />
                  {{ field.userAnswer }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Results -->
      <div v-else class="space-y-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t("quiz.completed") }}
          </h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {{ t("quiz.finalScore", { score, total: totalPossibleScore }) }}
          </p>
          <button
            class="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            @click="handleReset"
          >
            {{ t("quiz.tryAgain") }}
          </button>
        </div>

        <!-- Results List -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ t("quiz.results") }}
          </h3>
          <div
            v-for="(card, cardIndex) in quizState.cards"
            :key="cardIndex"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4"
          >
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ card.card.name }}
            </h4>
            <div class="space-y-2">
              <div
                v-for="field in card.fields"
                :key="field.name"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t(`quiz.fields.${field.name}`) }}
                  </p>
                  <p
                    :class="[
                      'text-sm',
                      field.isCorrect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400',
                    ]"
                  >
                    {{ field.userAnswer }}
                  </p>
                </div>
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    field.isCorrect
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900',
                  ]"
                >
                  <Icon
                    :name="field.isCorrect ? 'ph:check-bold' : 'ph:x-bold'"
                    class="w-5 h-5"
                    :class="
                      field.isCorrect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useMagicCardsQuizDaily } from "~/composables/useMagicCardsQuizDaily";

const { t } = useI18n();

const {
  quizState,
  currentCard,
  currentFields,
  score,
  isCompleted,
  totalPossibleScore,
  submitAnswer,
  resetQuiz,
} = useMagicCardsQuizDaily();

const fieldAnswers = ref<Record<string, string>>({});

const handleSubmit = (fieldName: string) => {
  const answer = fieldAnswers.value[fieldName];
  if (!answer?.trim()) return;
  submitAnswer(fieldName, answer);
  fieldAnswers.value[fieldName] = "";
};

const handleReset = () => {
  resetQuiz();
  fieldAnswers.value = {};
};
</script>
