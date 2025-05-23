import { defineStore } from "pinia";
import type { CardOptions } from "~/composables/useMagicCards";

interface MagicQuizState {
  formData: CardOptions;
  isEnglishCovered: boolean;
  isSpanishCovered: boolean;
}

export const useMagicQuizStore = defineStore("magicQuiz", {
  state: (): MagicQuizState => ({
    formData: {
      language: "es",
      set: "mh3",
    },
    isEnglishCovered: false,
    isSpanishCovered: false,
  }),

  actions: {
    updateFormData(data: CardOptions) {
      this.formData = data;
    },
    toggleEnglishOverlay() {
      this.isEnglishCovered = !this.isEnglishCovered;
    },
    toggleSpanishOverlay() {
      this.isSpanishCovered = !this.isSpanishCovered;
    },
  },
});
