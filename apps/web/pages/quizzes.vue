<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">StarCraft Unit Translation Quiz</h1>

    <div v-if="currentUnit" class="max-w-2xl mx-auto">
      <!-- Unit Portrait -->
      <div class="mb-6">
        <img
          :src="currentUnit.portrait"
          :alt="currentUnit.name"
          class="w-64 h-64 object-cover mx-auto rounded-lg shadow-lg"
        />
      </div>

      <!-- Translation Input -->
      <div class="mb-4">
        <label for="translation" class="block text-lg mb-2"
          >What is the Spanish translation for this unit?</label
        >
        <div class="flex gap-4">
          <input
            id="translation"
            v-model="userAnswer"
            @keyup.enter="checkAnswer"
            type="text"
            class="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Spanish translation..."
            :disabled="showFeedback && isCorrect"
          />
          <button
            @click="checkAnswer"
            class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-600"
            :disabled="!userAnswer.trim()"
          >
            Check
          </button>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="showFeedback" class="mb-4">
        <div
          :class="[
            'p-4 rounded-lg',
            isCorrect
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
          ]"
        >
          <p class="font-semibold">{{ feedbackMessage }}</p>
          <p v-if="!isCorrect" class="mt-2">
            Correct answer: {{ currentUnit.spanish }}
          </p>
        </div>
      </div>

      <!-- Next Button -->
      <button
        v-if="showFeedback && isCorrect"
        @click="nextQuestion"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Next Unit
      </button>
    </div>

    <!-- Quiz Complete -->
    <div v-else class="text-center">
      <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p class="mb-4">Your score: {{ score }} out of {{ totalQuestions }}</p>
      <button
        @click="restartQuiz"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Start New Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const units = [
  {
    name: "Marine",
    spanish: "Marine",
    portrait: "/images/marine.gif",
  },
  {
    name: "Firebat",
    spanish: "Lanzallamas",
    portrait: "/images/firebat.gif",
  },
  {
    name: "Ghost",
    spanish: "Fantasma",
    portrait: "/images/ghost.gif",
  },
  {
    name: "Medic",
    spanish: "Médico",
    portrait: "/images/medic.gif",
  },
  {
    name: "Vulture",
    spanish: "Buitre",
    portrait: "/images/vulture.gif",
  },
  {
    name: "Siege Tank",
    spanish: "Tanque de Asedio",
    portrait: "/images/terran_siege_tank.gif",
  },
  {
    name: "Goliath",
    spanish: "Goliat",
    portrait: "/images/goliath.gif",
  },
  {
    name: "Wraith",
    spanish: "Espectro",
    portrait: "/images/terran_wraith.gif",
  },
  {
    name: "Battlecruiser",
    spanish: "Crucero de Batalla",
    portrait: "/images/battlecruiser.gif",
  },
  {
    name: "Valkyrie",
    spanish: "Valquiria",
    portrait: "/images/terran_valkyrie.gif",
  },
  {
    name: "Science Vessel",
    spanish: "Nave Científica",
    portrait: "/images/terran_science_vessel.gif",
  },
  {
    name: "Dropship",
    spanish: "Nave de Desembarco",
    portrait: "/images/dropship.gif",
  },
];

const currentUnit = ref(null);
const userAnswer = ref("");
const showFeedback = ref(false);
const isCorrect = ref(false);
const feedbackMessage = ref("");
const score = ref(0);
const totalQuestions = ref(0);
const usedUnits = ref([]);

const getRandomUnit = () => {
  const availableUnits = units.filter(
    (unit) => !usedUnits.value.includes(unit.name)
  );
  if (availableUnits.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * availableUnits.length);
  return availableUnits[randomIndex];
};

const checkAnswer = () => {
  if (!userAnswer.value.trim()) return;

  const normalizedUserAnswer = userAnswer.value.trim().toLowerCase();
  const normalizedCorrectAnswer = currentUnit.value.spanish.toLowerCase();

  isCorrect.value = normalizedUserAnswer === normalizedCorrectAnswer;
  feedbackMessage.value = isCorrect.value
    ? "¡Correcto! Well done!"
    : "Incorrect. Try again!";

  if (isCorrect.value) {
    score.value++;
  }

  showFeedback.value = true;
};

const nextQuestion = () => {
  if (currentUnit.value) {
    usedUnits.value.push(currentUnit.value.name);
  }

  currentUnit.value = getRandomUnit();
  userAnswer.value = "";
  showFeedback.value = false;
  isCorrect.value = false;
  feedbackMessage.value = "";
};

const restartQuiz = () => {
  score.value = 0;
  usedUnits.value = [];
  totalQuestions.value = units.length;
  nextQuestion();
};

onMounted(() => {
  restartQuiz();
});
</script>
