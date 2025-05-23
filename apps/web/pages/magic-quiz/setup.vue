<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      Magic: The Gathering Quiz Setup
    </h1>

    <CardForm v-model="formData" @submit="handleFormSubmit" />

    <div class="mt-8">
      <Button
        label="Start Quiz"
        icon="pi pi-play"
        class="w-full md:w-auto"
        @click="navigateToQuiz"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CardForm from "~/components/magic-cards/CardForm.vue";
import type { CardOptions } from "~/composables/useMagicCards";
import { useMagicQuizStore } from "~/stores/magicQuiz";

const router = useRouter();
const store = useMagicQuizStore();

const formData = ref<CardOptions>({
  language: store.formData.language,
  set: store.formData.set,
});

const handleFormSubmit = (data: CardOptions) => {
  formData.value = data;
  store.updateFormData(data);
};

const navigateToQuiz = () => {
  router.push("/magic-quiz/quiz");
};
</script>
