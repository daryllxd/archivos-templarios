import { useState } from "#app";
import type { ScryfallCard } from "@scryfall/api-types";
import { useQuery } from "@tanstack/vue-query";
import { computed, toRaw, watch } from "vue";
import type { DailyQuizzes, QuizQuestions } from "~/types/supabase";

interface QuizField {
  name: string;
  value: string;
  isAnswered: boolean;
  isCorrect: boolean | null;
  userAnswer: string | null;
}

interface QuizCard {
  card: ScryfallCard.Normal;
  fields: QuizField[];
}

interface QuizState {
  cards: QuizCard[];
  currentIndex: number;
  isCompleted: boolean;
  score: number;
}

interface QuizResponse {
  quiz: DailyQuizzes;
  questions: QuizQuestions[];
}

export const useMagicCardsQuizDaily = () => {
  // State for the quiz
  const quizState = useState<QuizState>("magic-cards-quiz-daily", () => ({
    cards: [],
    currentIndex: 0,
    isCompleted: false,
    score: 0,
  }));

  const fetchCard = async (cardName: string): Promise<ScryfallCard.Normal> => {
    const searchUrl = new URL("https://api.scryfall.com/cards/search");
    searchUrl.searchParams.set("q", `name:"${cardName}" lang:es`);
    const response = await fetch(searchUrl.toString());
    const data = await response.json();
    return data.data[0] as ScryfallCard.Normal;
  };

  const createQuizFields = (card: ScryfallCard.Normal): QuizField[] => {
    return [
      {
        name: "name",
        value: card.name,
        isAnswered: false,
        isCorrect: null,
        userAnswer: null,
      },
      {
        name: "type_line",
        value: card.type_line,
        isAnswered: false,
        isCorrect: null,
        userAnswer: null,
      },
      {
        name: "oracle_text",
        value: card.oracle_text,
        isAnswered: false,
        isCorrect: null,
        userAnswer: null,
      },
    ];
  };

  // Query for fetching daily quiz
  const {
    data: quizData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["daily-quiz", "magic_cards"],
    queryFn: async () => {
      const response = await fetch("/api/quizzes/daily/magic_cards");
      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }
      return response.json() as Promise<QuizResponse>;
    },
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const initializeQuiz = async () => {
    try {
      if (!quizData.value?.questions) {
        throw new Error("No quiz questions found");
      }

      const rawQuestions = toRaw(quizData.value.questions);

      // Fetch card details for each question
      const cards = await Promise.all(
        rawQuestions.map(async (question) => {
          const card = await fetchCard(question.question_name);
          return {
            card,
            fields: createQuizFields(card),
          };
        })
      );

      quizState.value = {
        cards,
        currentIndex: 0,
        isCompleted: false,
        score: 0,
      };
    } catch (error) {
      console.error("Error initializing quiz:", error);
      throw error;
    }
  };

  // Watch for quiz data changes
  watch(
    quizData,
    (newData) => {
      if (newData) {
        initializeQuiz();
      }
    },
    { immediate: true }
  );

  const submitAnswer = (fieldName: string, answer: string) => {
    const currentCard = quizState.value.cards[quizState.value.currentIndex];
    const field = currentCard.fields.find((f) => f.name === fieldName);

    if (!field) return;

    const isCorrect = answer.toLowerCase() === field.value.toLowerCase();
    field.isAnswered = true;
    field.isCorrect = isCorrect;
    field.userAnswer = answer;

    if (isCorrect) {
      quizState.value.score += 1;
    }

    // Check if all fields for current card are answered
    const allFieldsAnswered = currentCard.fields.every((f) => f.isAnswered);
    if (allFieldsAnswered) {
      // Move to next card or complete quiz
      if (quizState.value.currentIndex < quizState.value.cards.length - 1) {
        quizState.value.currentIndex += 1;
      } else {
        quizState.value.isCompleted = true;
      }
    }
  };

  const resetQuiz = () => {
    quizState.value = {
      cards: quizState.value.cards.map((card) => ({
        ...card,
        fields: card.fields.map((field) => ({
          ...field,
          isAnswered: false,
          isCorrect: null,
          userAnswer: null,
        })),
      })),
      currentIndex: 0,
      isCompleted: false,
      score: 0,
    };
  };

  // Computed properties
  const currentCard = computed(
    () => quizState.value.cards[quizState.value.currentIndex]?.card
  );
  const currentFields = computed(
    () => quizState.value.cards[quizState.value.currentIndex]?.fields || []
  );
  const progress = computed(() => ({
    current: quizState.value.currentIndex + 1,
    total: quizState.value.cards.length,
  }));
  const score = computed(() => quizState.value.score);
  const isCompleted = computed(() => quizState.value.isCompleted);
  const totalPossibleScore = computed(() =>
    quizState.value.cards.reduce((total, card) => total + card.fields.length, 0)
  );

  return {
    // State
    quizState,
    currentCard,
    currentFields,
    progress,
    score,
    isCompleted,
    totalPossibleScore,
    isLoading,
    error,

    // Methods
    submitAnswer,
    resetQuiz,
  };
};
