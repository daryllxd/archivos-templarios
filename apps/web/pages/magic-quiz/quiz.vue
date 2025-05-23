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
      class="mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
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

    <div v-if="card && cardEs" class="grid md:grid-cols-2 gap-4 mx-auto">
      <!-- Spanish Card -->
      <div
        class="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
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
        class="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
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
            <div class="flex gap-2">
              <InputText
                id="cardName"
                v-model="answers.cardName"
                class="w-full"
                :class="{
                  'p-invalid': fieldStatus.cardName === 'incorrect',
                  'p-valid': fieldStatus.cardName === 'correct',
                }"
              />
              <Button
                icon="pi pi-check"
                class="p-button-success flex-shrink-0"
                :disabled="
                  !answers.cardName || fieldStatus.cardName === 'correct'
                "
                @click="checkField('cardName')"
              />
            </div>
            <small
              v-if="fieldStatus.cardName === 'correct'"
              class="text-green-500"
            >
              Correct!
            </small>
            <small
              v-else-if="fieldStatus.cardName === 'incorrect'"
              class="text-red-500"
            >
              Try again
            </small>
          </div>

          <div class="field">
            <label
              for="cardType"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Type
            </label>
            <div class="flex gap-2">
              <InputText
                id="cardType"
                v-model="answers.cardType"
                class="w-full"
                :class="{
                  'p-invalid': fieldStatus.cardType === 'incorrect',
                  'p-valid': fieldStatus.cardType === 'correct',
                }"
              />
              <Button
                icon="pi pi-check"
                class="p-button-success flex-shrink-0"
                :disabled="
                  !answers.cardType || fieldStatus.cardType === 'correct'
                "
                @click="checkField('cardType')"
              >
                Check
              </Button>
            </div>
            <small
              v-if="fieldStatus.cardType === 'correct'"
              class="text-green-500"
            >
              Correct!
            </small>
            <small
              v-else-if="fieldStatus.cardType === 'incorrect'"
              class="text-red-500"
            >
              Try again
            </small>
          </div>

          <div class="field">
            <label
              for="cardText"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Text
            </label>
            <div class="flex gap-2">
              <Textarea
                id="cardText"
                v-model="answers.cardText"
                rows="4"
                class="w-full"
                :class="{
                  'p-invalid': fieldStatus.cardText === 'incorrect',
                  'p-valid': fieldStatus.cardText === 'correct',
                }"
              />
              <Button
                icon="pi pi-check"
                class="p-button-success flex-shrink-0"
                :disabled="
                  !answers.cardText || fieldStatus.cardText === 'correct'
                "
                @click="checkField('cardText')"
              >
                Check
              </Button>
            </div>
            <small
              v-if="fieldStatus.cardText === 'correct'"
              class="text-green-500"
            >
              Correct!
            </small>
            <small
              v-else-if="fieldStatus.cardText === 'incorrect'"
              class="text-red-500"
            >
              Try again
            </small>
          </div>

          <div class="flex justify-end">
            <Button
              label="Show All Answers"
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

const fieldStatus = ref({
  cardName: "unchecked",
  cardType: "unchecked",
  cardText: "unchecked",
} as Record<string, "unchecked" | "correct" | "incorrect">);

const showAnswers = ref(false);

const checkField = (field: keyof typeof answers.value) => {
  if (!card.value) return;

  const isCorrect =
    answers.value[field] ===
    card.value[
      field === "cardName"
        ? "name"
        : field === "cardType"
          ? "type_line"
          : "oracle_text"
    ];
  fieldStatus.value[field] = isCorrect ? "correct" : "incorrect";

  // If all fields are correct, show the answers
  if (
    Object.values(fieldStatus.value).every((status) => status === "correct")
  ) {
    showAnswers.value = true;
  }
};
</script>
