import { defineStore } from "pinia";
import type { CardOptions } from "~/composables/useMagicCards";

interface MagicQuizState {
  formData: CardOptions;
}

export const useMagicQuizStore = defineStore("magicQuiz", {
  state: (): MagicQuizState => ({
    formData: {
      language: "es",
      set: "mh3",
    },
  }),

  actions: {
    updateFormData(data: CardOptions) {
      this.formData = data;
    },
  },
});
