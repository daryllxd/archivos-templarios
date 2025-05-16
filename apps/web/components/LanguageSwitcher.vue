<script setup lang="ts">
import { Dropdown } from "#components";
import { ref } from "vue";

interface Language {
  id: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Español", flag: "🇪🇸" },
];

const selectedLanguage = ref<Language>(languages[0]);

const optionLabel = (language: Language) => `${language.flag} ${language.name}`;
</script>

<template>
  <Dropdown
    v-model="selectedLanguage"
    :options="languages"
    :option-label="optionLabel"
    class="w-full"
    :pt="{
      root: { class: 'w-full' },
      input: { class: 'w-full bg-background border-input text-foreground' },
      trigger: { class: 'bg-background border-input' },
      panel: { class: 'bg-popover text-popover-foreground' },
      item: { class: 'hover:bg-accent hover:text-accent-foreground' },
    }"
  />
</template>
