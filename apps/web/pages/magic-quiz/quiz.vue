<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Magic: The Gathering Quiz
      </h1>
      <Button
        label="Back to Setup"
        icon="pi pi-arrow-left"
        class="p-button-secondary"
        @click="router.push('/magic-quiz/setup')"
      />
    </div>

    <div class="mb-6">
      <Button
        label="Get Random Card"
        icon="pi pi-refresh"
        :loading="isFetching"
        @click="() => refetch()"
      />
    </div>

    <div class="mb-4 flex space-x-4">
      <Button
        :label="isEnglishCovered ? 'Show English' : 'Hide English'"
        icon="pi pi-eye"
        @click="store.toggleEnglishOverlay()"
      />
      <Button
        :label="isSpanishCovered ? 'Show Spanish' : 'Hide Spanish'"
        icon="pi pi-eye"
        @click="store.toggleSpanishOverlay()"
      />
    </div>

    <div
      v-if="error"
      class="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
    >
      <p class="font-semibold">Error loading cards:</p>
      <p>{{ error.message }}</p>
      <Button
        label="Try Again"
        icon="pi pi-refresh"
        class="p-button-danger mt-2"
        @click="() => refetch()"
      />
    </div>

    <div
      v-if="card && cardEs"
      class="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto"
    >
      <!-- Spanish Card -->
      <div
        class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
      >
        <CardImage
          :image-url="cardEs.image_uris?.normal"
          :alt-text="cardEs.name"
        />
        <div
          v-if="isSpanishCovered"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span class="text-white text-xl">Covered</span>
        </div>
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ cardEs.printed_name || cardEs.name }}
        </h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          {{ cardEs.printed_type_line || cardEs.type_line }}
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          {{ cardEs.printed_text || cardEs.oracle_text }}
        </p>
      </div>

      <!-- Answer Form -->
      <div
        class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Your Answer
        </h2>
        <div class="space-y-4">
          <div class="field">
            <label
              for="cardName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Name
            </label>
            <InputText
              id="cardName"
              v-model="answers.cardName"
              class="w-full"
              :class="{
                'p-invalid': showAnswers && answers.cardName !== card.name,
              }"
            />
          </div>
          <div class="field">
            <label
              for="cardType"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Type
            </label>
            <InputText
              id="cardType"
              v-model="answers.cardType"
              class="w-full"
              :class="{
                'p-invalid': showAnswers && answers.cardType !== card.type_line,
              }"
            />
          </div>
          <div class="field">
            <label
              for="cardText"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Text
            </label>
            <Textarea
              id="cardText"
              v-model="answers.cardText"
              rows="4"
              class="w-full"
              :class="{
                'p-invalid':
                  showAnswers && answers.cardText !== card.oracle_text,
              }"
            />
          </div>
          <div class="flex space-x-2">
            <Button
              label="Check Answers"
              icon="pi pi-check"
              @click="checkAnswers"
            />
            <Button
              label="Show Answers"
              icon="pi pi-eye"
              class="p-button-secondary"
              @click="showAnswers = true"
            />
          </div>
        </div>
      </div>

      <!-- English Card (Hidden by default) -->
      <div
        v-if="showAnswers"
        class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative col-span-2"
      >
        <CardImage :image-url="card.image_uris?.normal" :alt-text="card.name" />
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ card.name }}
        </h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          {{ card.type_line }}
        </p>
        <p class="text-gray-500 dark:text-gray-400">{{ card.oracle_text }}</p>
      </div>
    </div>

    <div
      v-else-if="isFetching"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      Loading...
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Click the button to get a random card!
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CardImage from "~/components/magic-cards/CardImage.vue";
import { useMagicCards } from "~/composables/useMagicCards";
import { useMagicQuizStore } from "~/stores/magicQuiz";

const router = useRouter();
const store = useMagicQuizStore();
const { formData, isEnglishCovered, isSpanishCovered } = storeToRefs(store);

const { card, cardEs, refetch, isFetching, error } = useMagicCards(
  formData.value
);

const answers = ref({
  cardName: "",
  cardType: "",
  cardText: "",
});

const showAnswers = ref(false);

const checkAnswers = () => {
  if (!card.value) return;

  const isCorrect =
    answers.value.cardName === card.value.name &&
    answers.value.cardType === card.value.type_line &&
    answers.value.cardText === card.value.oracle_text;

  if (isCorrect) {
    // You could add a success message or animation here
    showAnswers.value = true;
  }
};
</script>
