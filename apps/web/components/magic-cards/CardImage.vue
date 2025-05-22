<template>
  <div>
    <div
      v-if="imageLoading"
      class="w-full rounded mb-4 h-[400px] bg-gray-200 dark:bg-gray-700 animate-pulse"
    ></div>
    <img
      v-show="!imageLoading"
      :src="imageUrl"
      :alt="altText"
      class="w-full rounded mb-4 h-[400px] object-contain"
      @load="handleImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  imageUrl?: string;
  altText: string;
}

const props = defineProps<Props>();
const imageLoading = ref(true);

const handleImageLoad = () => {
  imageLoading.value = false;
};

watch(
  () => props.imageUrl,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      imageLoading.value = true;
    }
  }
);
</script>
