<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      {{ t("collage.title") }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Image Selection -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ t("collage.selectImages") }}
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(image, index) in availableImages"
            :key="index"
            class="relative aspect-square cursor-pointer"
            :class="{ 'ring-2 ring-amber-500': selectedImages.includes(image) }"
            @click="toggleImage(image)"
          >
            <img
              :src="image"
              :alt="`Image ${index + 1}`"
              class="w-full h-full object-cover rounded-lg"
            />
            <div
              v-if="selectedImages.includes(image)"
              class="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1"
            >
              <Icon name="ph:check-bold" class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Collage Preview -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ t("collage.preview") }}
        </h2>
        <div
          class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
        >
          <div class="grid grid-cols-2 grid-rows-2 h-full">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="relative"
            >
              <img
                :src="image"
                :alt="`Collage image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-for="n in 4 - selectedImages.length"
              :key="`empty-${n}`"
              class="bg-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Sample images from public directory - you'll need to add these images
const availableImages = [
  "/images/terran_marine.gif",
  "/images/terran_firebat.gif",
  "/images/terran_ghost.gif",
  "/images/medic.gif",
  "/images/vulture.gif",
  "/images/terran_siege_tank.gif",
  "/images/goliath.gif",
  "/images/terran_wraith.gif",
  "/images/battlecruiser.gif",
  "/images/terran_valkyrie.gif",
  "/images/terran_science_vessel.gif",
  "/images/neutral_dropship.gif",
];

const selectedImages = ref<string[]>([]);

const toggleImage = (image: string) => {
  const index = selectedImages.value.indexOf(image);
  if (index === -1) {
    if (selectedImages.value.length < 4) {
      selectedImages.value.push(image);
    }
  } else {
    selectedImages.value.splice(index, 1);
  }
};
</script>
