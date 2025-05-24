<template>
  <div
    class="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
  >
    <CardImage :image-url="card.image_uris?.normal" :alt-text="card.name" />
    <div class="flex items-center gap-2 mb-2">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ card.printed_name || card.name }}
      </h2>
      <div
        class="flex gap-1 text-lg"
        v-html="replaceManaCosts(card.mana_cost)"
      ></div>
    </div>
    <p class="text-gray-700 dark:text-gray-300 mb-2">
      {{ card.printed_type_line || card.type_line }}
    </p>
    <p
      class="text-gray-500 dark:text-gray-400"
      v-html="replaceManaCosts(card.printed_text || card.oracle_text)"
    ></p>
    <p
      v-if="card.flavor_text"
      class="text-gray-500 dark:text-gray-400 italic"
      v-html="replaceManaCosts(card.flavor_text)"
    ></p>
  </div>
</template>

<script setup lang="ts">
import type { ScryfallCard } from "@scryfall/api-types";
import "mana-font/css/mana.css";
import { replaceManaCosts } from "~/utils/mana-cost";
import CardImage from "./CardImage.vue";

defineProps<{
  card: ScryfallCard.Normal;
}>();
</script>
