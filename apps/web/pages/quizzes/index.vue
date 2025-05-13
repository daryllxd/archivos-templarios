<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">My Quizzes</h1>
      <NuxtLink
        to="/quizzes/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Create new quiz"
        tabindex="0"
      >
        Create New Quiz
      </NuxtLink>
    </div>

    <!-- Quiz List -->
    <div
      v-if="quizzes.length > 0"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="quiz in quizzes"
        :key="quiz.id"
        class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold mb-2">{{ quiz.title }}</h2>
        <p class="text-gray-600 mb-4">{{ quiz.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ quiz.questions.length }} questions
          </span>
          <div class="flex gap-2">
            <NuxtLink
              :to="`/quizzes/${quiz.id}/edit`"
              class="text-blue-600 hover:text-blue-800"
              aria-label="Edit quiz"
              tabindex="0"
            >
              Edit
            </NuxtLink>
            <Button
              variant="destructive"
              aria-label="Delete quiz"
              tabindex="0"
              @click="handleDeleteQuiz(quiz.id)"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <p class="text-gray-600 mb-4">You haven't created any quizzes yet.</p>
      <NuxtLink
        to="/quizzes/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        aria-label="Create your first quiz"
        tabindex="0"
      >
        Create Your First Quiz
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// TODO: Replace with actual API call
const quizzes = ref([
  {
    id: "1",
    title: "StarCraft Units",
    description: "Test your knowledge of StarCraft unit translations",
    questions: [
      { id: "1", text: "What is the Spanish translation for Marine?" },
      { id: "2", text: "What is the Spanish translation for Firebat?" },
    ],
  },
  // Add more sample quizzes here
]);

const handleDeleteQuiz = async (quizId) => {
  if (!confirm("Are you sure you want to delete this quiz?")) return;

  try {
    // TODO: Replace with actual API call
    quizzes.value = quizzes.value.filter((q) => q.id !== quizId);
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    alert("Failed to delete quiz. Please try again.");
  }
};
</script>
