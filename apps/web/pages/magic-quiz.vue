<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Magic: The Gathering Random Card Quiz
    </h1>

    <CardForm v-model="formData" @submit="handleFormSubmit" />

    <div class="mb-6">
      <button
        class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        :disabled="isFetching"
        @click="() => refetch()"
      >
        <span v-if="isFetching">Loading...</span>
        <span v-else>Get Random Card</span>
      </button>
    </div>
    <div class="mb-4 flex space-x-4">
      <button
        class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        @click="toggleEnglishOverlay"
      >
        {{ isEnglishCovered ? "Show English" : "Hide English" }}
      </button>
      <button
        class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        @click="toggleSpanishOverlay"
      >
        {{ isSpanishCovered ? "Show Spanish" : "Hide Spanish" }}
      </button>
    </div>
    <div
      v-if="error"
      class="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
    >
      <p class="font-semibold">Error loading cards:</p>
      <p>{{ error.message }}</p>
      <button
        class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        @click="() => refetch()"
      >
        Try Again
      </button>
    </div>
    <div
      v-if="card && cardEs"
      class="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto"
    >
      <!-- English Card -->
      <div
        class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
      >
        <CardImage :image-url="card.image_uris?.normal" :alt-text="card.name" />
        <div
          v-if="isEnglishCovered"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span class="text-white text-xl">Covered</span>
        </div>
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {{ card.name }}
        </h2>
        <p class="text-gray-700 dark:text-gray-300 mb-2">
          {{ card.type_line }}
        </p>
        <p class="text-gray-500 dark:text-gray-400">{{ card.oracle_text }}</p>
      </div>
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
import { ref, watch } from "vue";
import CardForm from "~/components/magic-cards/CardForm.vue";
import CardImage from "~/components/magic-cards/CardImage.vue";
import { useMagicCards, type CardOptions } from "~/composables/useMagicCards";

const formData = ref<CardOptions>({
  language: "es",
  set: "mh3",
});

const { card, cardEs, refetch, isFetching, error, updateOptions } =
  useMagicCards(formData.value);

// Watch for form data changes and update the options
watch(
  formData,
  (newValue) => {
    updateOptions(newValue);
  },
  { deep: true }
);

const isEnglishCovered = ref(false);
const isSpanishCovered = ref(false);

const handleFormSubmit = (data: CardOptions) => {
  formData.value = data;
  refetch();
};

const toggleEnglishOverlay = () => {
  isEnglishCovered.value = !isEnglishCovered.value;
};

const toggleSpanishOverlay = () => {
  isSpanishCovered.value = !isSpanishCovered.value;
};
</script>
