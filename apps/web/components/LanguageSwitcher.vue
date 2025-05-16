<script setup lang="ts">
import Select from "primevue/select";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

type Locale = "en" | "es";

interface Language {
  id: Locale;
  name: string;
  flag: string;
}

const { setLocale } = useI18n();

const languages: Language[] = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Español", flag: "🇪🇸" },
];

const selectedLanguage = ref<Language>(languages[0]);

const handleLanguageChange = (event: { value: Language }) => {
  console.log("event", event);
  setLocale(event.value.id);
};
</script>

<template>
  <Select
    v-model="selectedLanguage"
    :options="languages"
    option-label="name"
    placeholder="Select Language"
    class="w-full md:w-40"
    :pt="{
      root: { class: 'w-full' },
      input: { class: 'w-full bg-background border-input text-foreground' },
      trigger: { class: 'bg-background border-input' },
      panel: { class: 'bg-popover text-popover-foreground' },
      item: { class: 'hover:bg-accent hover:text-accent-foreground' },
    }"
    @change="handleLanguageChange"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <span class="mr-2">{{ slotProps.value.flag }}</span>
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <span class="mr-2">{{ slotProps.option.flag }}</span>
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
    <template #header>
      <div class="font-medium p-3">{{ $t("selectLanguage") }}</div>
    </template>
  </Select>
</template>
