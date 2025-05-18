<template>
  <InputText
    :model-value="modelValue"
    :class="[
      'w-full',
      'dark:bg-gray-700 dark:text-white dark:border-gray-600',
      'focus:border-amber-500 focus:ring-amber-500',
      'rounded-md',
      'shadow-sm',
      'sm:text-sm',
    ]"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
