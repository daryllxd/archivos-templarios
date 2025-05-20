<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
      {{ t("collage.title") }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Image Selection -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ t("collage.selectImages") }}
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{
              t("collage.selectedCount", {
                count: selectedImages.length,
                max: maxImages,
              })
            }}
          </div>
        </div>

        <!-- Layout Controls -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t("collage.gridSize") }}
            </label>
            <div class="flex gap-2">
              <button
                v-for="size in gridSizes"
                :key="size.value"
                class="px-3 py-1 rounded-md text-sm"
                :class="[
                  gridSize === size.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                ]"
                @click="gridSize = size.value"
              >
                {{ size.label }}
              </button>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t("collage.layoutStyle") }}
            </label>
            <div class="flex gap-2">
              <button
                v-for="style in layoutStyles"
                :key="style.value"
                class="px-3 py-1 rounded-md text-sm"
                :class="[
                  layoutStyle === style.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                ]"
                @click="layoutStyle = style.value"
              >
                {{ style.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Image Search -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t("collage.searchImages") }}
            </label>
            <div class="flex gap-2">
              <input
                v-model="searchQuery"
                type="text"
                class="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                :placeholder="t('collage.searchPlaceholder')"
                @keyup.enter="handleSearch"
              />
              <button
                class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                :disabled="isSearching"
                @click="handleSearch"
              >
                <Icon
                  v-if="isSearching"
                  name="ph:spinner-gap-bold"
                  class="w-5 h-5 animate-spin"
                />
                <Icon v-else name="ph:magnifying-glass-bold" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("collage.searchResults") }}
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(result, index) in searchResults"
                :key="index"
                class="relative aspect-square cursor-pointer group"
                @click="addSearchImage(result.link)"
              >
                <img
                  :src="result.link"
                  :alt="result.title"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Default Images -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t("collage.defaultImages") }}
          </h3>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(image, index) in availableImages"
              :key="index"
              class="relative aspect-square cursor-pointer"
              :class="{
                'ring-2 ring-amber-500': selectedImages.includes(image),
              }"
              @click="toggleImage(image)"
            >
              <img
                :src="image"
                :alt="`Image ${index + 1}`"
                class="w-full h-full object-cover rounded-lg"
              />
              <div
                v-if="selectedImages.includes(image)"
                class="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-1"
              >
                <Icon name="ph:check-bold" class="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Collage Preview -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ t("collage.preview") }}
          </h2>
          <button
            v-if="selectedImages.length > 0"
            class="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            :disabled="isDownloading"
            @click="handleDownload"
          >
            <Icon
              v-if="isDownloading"
              name="ph:spinner-gap-bold"
              class="w-5 h-5 mr-2 animate-spin"
            />
            <Icon v-else name="ph:download-bold" class="w-5 h-5 mr-2" />
            {{ t("collage.download") }}
          </button>
        </div>
        <div
          ref="previewRef"
          class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
        >
          <div
            class="h-full"
            :class="{
              'grid grid-cols-2 grid-rows-2':
                layoutStyle === 'grid' && gridSize === 2,
              'grid grid-cols-3 grid-rows-3':
                layoutStyle === 'grid' && gridSize === 3,
              'grid grid-cols-4 grid-rows-4':
                layoutStyle === 'grid' && gridSize === 4,
              'flex flex-col': layoutStyle === 'column',
              'flex flex-row': layoutStyle === 'row',
            }"
          >
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="relative"
              :class="{
                'w-full h-full': layoutStyle === 'grid',
                'w-full h-1/4': layoutStyle === 'column',
                'w-1/4 h-full': layoutStyle === 'row',
              }"
            >
              <img
                :src="image"
                :alt="`Collage image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-for="n in maxImages - selectedImages.length"
              :key="`empty-${n}`"
              class="bg-gray-200 dark:bg-gray-700"
              :class="{
                'w-full h-full': layoutStyle === 'grid',
                'w-full h-1/4': layoutStyle === 'column',
                'w-1/4 h-full': layoutStyle === 'row',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const previewRef = ref<HTMLElement | null>(null);
const isDownloading = ref(false);
const isSearching = ref(false);
const searchQuery = ref("");
const searchResults = ref<Array<{ link: string; title: string }>>([]);

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
const gridSize = ref(2);
const layoutStyle = ref("grid");

const gridSizes = [
  { value: 2, label: "2x2" },
  { value: 3, label: "3x3" },
  { value: 4, label: "4x4" },
];

const layoutStyles = [
  { value: "grid", label: "Grid" },
  { value: "row", label: "Row" },
  { value: "column", label: "Column" },
];

const maxImages = computed(() => {
  if (layoutStyle.value === "grid") {
    return gridSize.value * gridSize.value;
  }
  return 4; // For row and column layouts
});

const toggleImage = (image: string) => {
  const index = selectedImages.value.indexOf(image);
  if (index === -1) {
    if (selectedImages.value.length < maxImages.value) {
      selectedImages.value.push(image);
    }
  } else {
    selectedImages.value.splice(index, 1);
  }
};

const handleDownload = async () => {
  if (!previewRef.value || isDownloading.value) return;

  isDownloading.value = true;

  try {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Set canvas size to match the preview
    const previewRect = previewRef.value.getBoundingClientRect();
    canvas.width = previewRect.width;
    canvas.height = previewRect.height;

    // Fill background
    ctx.fillStyle = "#f3f4f6"; // bg-gray-100
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions based on layout
    let imageWidth, imageHeight;

    if (layoutStyle.value === "grid") {
      const cols = gridSize.value;
      const rows = gridSize.value;
      imageWidth = canvas.width / cols;
      imageHeight = canvas.height / rows;
    } else if (layoutStyle.value === "row") {
      imageWidth = canvas.width / 4;
      imageHeight = canvas.height;
    } else {
      // column
      imageWidth = canvas.width;
      imageHeight = canvas.height / 4;
    }

    // Load and draw each image
    const imagePromises = selectedImages.value.map((src, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          let x, y;

          if (layoutStyle.value === "grid") {
            const cols = gridSize.value;
            x = (index % cols) * imageWidth;
            y = Math.floor(index / cols) * imageHeight;
          } else if (layoutStyle.value === "row") {
            x = index * imageWidth;
            y = 0;
          } else {
            // column
            x = 0;
            y = index * imageHeight;
          }

          ctx.drawImage(img, x, y, imageWidth, imageHeight);
          resolve(null);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    // Wait for all images to load and draw
    await Promise.all(imagePromises);

    // Convert canvas to blob and download
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/png");
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collage-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error creating collage:", error);
    alert(t("collage.downloadError"));
  } finally {
    isDownloading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim() || isSearching.value) return;

  isSearching.value = true;
  try {
    const response = await fetch(
      `/api/search-images?q=${encodeURIComponent(searchQuery.value)}`
    );
    const data = await response.json();
    searchResults.value = data.items || [];
  } catch (error) {
    console.error("Error searching images:", error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const addSearchImage = (imageUrl: string) => {
  if (selectedImages.value.length < maxImages.value) {
    selectedImages.value.push(imageUrl);
  }
};
</script>
