<template>
  <div class="flex items-center">
    <ToggleSwitch
      v-model="isDark"
      class="theme-switch"
      :pt="{
        root: {
          class:
            'relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        },
        slider: { class: 'bg-gray-200 dark:bg-gray-700' },
        handle: { class: 'bg-white dark:bg-gray-800' },
      }"
      :aria-label="isDark ? t('switchToLight') : t('switchToDark')"
      @change="handleThemeToggle"
    >
      <template #handle="{ checked }">
        <Icon
          :name="checked ? 'ph:sun-bold' : 'ph:moon-bold'"
          class="w-4 h-4 text-amber-500"
        />
      </template>
    </ToggleSwitch>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useThemeStore } from "~/stores/useThemeStore";

const { t } = useI18n();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const handleThemeToggle = () => {
  themeStore.toggleTheme();
};

onMounted(() => {
  themeStore.initTheme();
});
</script>
