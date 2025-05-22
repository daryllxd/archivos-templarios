import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { ScryfallApiInstance } from "./scryfall";

interface CardImage {
  normal: string;
}

interface Card {
  name: string;
  type_line: string;
  oracle_text: string;
  image_uris?: CardImage;
  printed_name?: string;
  printed_type_line?: string;
  printed_text?: string;
}

interface CardResponse {
  english: Card;
  spanish: Card | null;
}

interface CardOptions {
  language: string;
  set: string;
}

export const useMagicCards = () => {
  const options = ref<CardOptions>({
    language: "es",
    set: "mh3",
  });

  const getRandomCard = async (): Promise<CardResponse> => {
    try {
      // 1. Fetch a random card in English from the selected set
      const english = (await ScryfallApiInstance.getRandomCard(
        `set:${options.value.set}`
      )) as Card;

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
        searchRes.data && searchRes.data.length > 0 ? searchRes.data[0] : null;

      if (translated) {
        console.log(`Fetched ${options.value.language} card:`, translated.name);
      } else {
        console.warn(
          `No ${options.value.language} translation found for:`,
          english.name
        );
      }

      return { english, spanish: translated };
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
  };
};
