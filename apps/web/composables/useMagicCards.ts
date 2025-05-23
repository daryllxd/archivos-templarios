import { useState } from "#app";
import type { ScryfallCard } from "@scryfall/api-types";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { ScryfallApiInstance } from "./scryfall";

// We are using Normal but caution, the app can break with the double faced cards
interface CardResponse {
  english: ScryfallCard.Normal | null;
  spanish: ScryfallCard.Normal | null;
}

export interface CardOptions {
  language: string;
  set: string;
}

// Debug flags
const DEBUG_FORCE_CARD = true; // Set to true to always return Deep Analysis
const DEBUG_CACHE_RESPONSES = true; // Set to true to cache responses

// Debug functions
export const debugMagicCards = {
  getCache: () => {
    return useState<Record<string, CardResponse>>("magic-cards-cache").value;
  },
  clearCache: () => {
    useState<Record<string, CardResponse>>("magic-cards-cache").value = {};
  },
  setCacheEntry: (key: string, value: CardResponse) => {
    useState<Record<string, CardResponse>>("magic-cards-cache").value[key] =
      value;
  },
  getCacheEntry: (key: string) => {
    return useState<Record<string, CardResponse>>("magic-cards-cache").value[
      key
    ];
  },
};

export const useMagicCards = (
  initialOptions: CardOptions = { language: "es", set: "mh3" }
) => {
  const options = ref<CardOptions>(initialOptions);

  // Use Nuxt's useState for persistent cache
  const responseCache = useState<Record<string, CardResponse>>(
    "magic-cards-cache",
    () => ({})
  );

  const getRandomCard = async (): Promise<CardResponse> => {
    try {
      // Check cache first if enabled
      const cacheKey = `${options.value.language}-${options.value.set}`;
      if (DEBUG_CACHE_RESPONSES && responseCache.value[cacheKey]) {
        console.log("Using cached response for:", cacheKey);
        return responseCache.value[cacheKey];
      }

      let english: ScryfallCard.Normal | null = null;

      if (DEBUG_FORCE_CARD) {
        // Force Deep Analysis for debugging
        const searchUrl = new URL("https://api.scryfall.com/cards/search");
        searchUrl.searchParams.set("q", 'name:"Wing It"');
        const response = await fetch(searchUrl.toString());
        const data = await response.json();
        english = data.data[0] as ScryfallCard.Normal;
      } else {
        // Normal random card fetch
        english = (await ScryfallApiInstance.getRandomCard(
          `set:${options.value.set}`
        )) as ScryfallCard.Normal;
      }

      if (!english) {
        throw new Error("Failed to fetch English card");
      }

      console.log("Fetched English card:", english.name);

      // 2. Fetch the translated version by name
      const searchUrl = new URL("https://api.scryfall.com/cards/search");
      searchUrl.searchParams.set(
        "q",
        `lang:${options.value.language} name:"${english.name}"`
      );

      const searchRes = await fetch(searchUrl.toString()).then(async (res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch ${options.value.language} card: ${res.statusText}`
          );
        }
        return res.json();
      });

      const translated =
        searchRes.data && searchRes.data.length > 0
          ? (searchRes.data[0] as ScryfallCard.Normal)
          : null;

      if (translated) {
        console.log(`Fetched ${options.value.language} card:`, translated.name);
      } else {
        console.warn(
          `No ${options.value.language} translation found for:`,
          english.name
        );
      }

      const response = { english, spanish: translated };

      // Cache the response if enabled
      if (DEBUG_CACHE_RESPONSES) {
        console.log("Caching response for:", cacheKey);
        responseCache.value[cacheKey] = response;
      }

      return response;
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error;
    }
  };

  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["random-card", options],
    queryFn: getRandomCard,
    retry: 1,
  });

  const card = computed(() => data.value?.english);
  const cardEs = computed(() => data.value?.spanish);

  const updateOptions = (newOptions: CardOptions) => {
    options.value = newOptions;
  };

  return {
    card,
    cardEs,
    refetch,
    isFetching,
    error,
    updateOptions,
    options: computed(() => options.value),
  };
};
