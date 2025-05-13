<template>
  <div class="flex gap-1 items-center ml-2">
    <Button
      v-for="accent in accents"
      :key="accent"
      @click="$emit('insert', accent)"
      class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      {{ accent }}
    </Button>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  accents: {
    type: Array,
    default: () => ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"],
  },
});

defineEmits(["insert"]);
</script>
