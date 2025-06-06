<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink
        to="/quizzes"
        class="text-blue-600 hover:text-blue-800"
        aria-label="Back to quizzes"
        tabindex="0"
      >
        ← Back
      </NuxtLink>
      <h1 class="text-3xl font-bold">Create New Quiz</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Quiz Details -->
      <div class="space-y-4">
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Quiz Title
          </label>
          <input
            id="title"
            v-model="quiz.title"
            type="text"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quiz title"
            aria-label="Quiz title"
          />
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            v-model="quiz.description"
            rows="3"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Enter quiz description"
            aria-label="Quiz description"
          />
        </div>
      </div>

      <!-- Questions -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Questions</h2>
          <Button
            type="button"
            @click="handleAddQuestion"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            aria-label="Add question"
            tabindex="0"
          >
            Add Question
          </Button>
        </div>

        <div
          v-for="(question, index) in quiz.questions"
          :key="index"
          class="bg-gray-50 p-4 rounded-lg space-y-4"
        >
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium">Question {{ index + 1 }}</h3>
            <Button
              type="button"
              @click="handleRemoveQuestion(index)"
              class="text-red-600 hover:text-red-800"
              aria-label="Remove question"
              tabindex="0"
            >
              Remove
            </Button>
          </div>

          <div>
            <label
              :for="`question-${index}`"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Question Text
            </label>
            <input
              :id="`question-${index}`"
              v-model="question.text"
              type="text"
              required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              :placeholder="`Enter question ${index + 1}`"
              :aria-label="`Question ${index + 1} text`"
            />
          </div>

          <div>
            <label
              :for="`answer-${index}`"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Correct Answer
            </label>
            <input
              :id="`answer-${index}`"
              v-model="question.answer"
              type="text"
              required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              :placeholder="`Enter correct answer for question ${index + 1}`"
              :aria-label="`Correct answer for question ${index + 1}`"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-4">
        <NuxtLink
          to="/quizzes"
          class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          aria-label="Cancel quiz creation"
          tabindex="0"
        >
          Cancel
        </NuxtLink>
        <Button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="!isValid"
          aria-label="Create quiz"
          tabindex="0"
        >
          Create Quiz
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const quiz = ref({
  title: "",
  description: "",
  questions: [{ text: "", answer: "" }],
});

const isValid = computed(() => {
  return (
    quiz.value.title.trim() &&
    quiz.value.description.trim() &&
    quiz.value.questions.length > 0 &&
    quiz.value.questions.every((q) => q.text.trim() && q.answer.trim())
  );
});

const handleAddQuestion = () => {
  quiz.value.questions.push({ text: "", answer: "" });
};

const handleRemoveQuestion = (index) => {
  if (quiz.value.questions.length > 1) {
    quiz.value.questions.splice(index, 1);
  }
};

const handleSubmit = async () => {
  if (!isValid.value) return;

  try {
    // TODO: Replace with actual API call
    console.log("Creating quiz:", quiz.value);
    router.push("/quizzes");
  } catch (error) {
    console.error("Failed to create quiz:", error);
    alert("Failed to create quiz. Please try again.");
  }
};
</script>
