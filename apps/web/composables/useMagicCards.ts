import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
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

export const useMagicCards = () => {
  const getRandomCard = async (): Promise<CardResponse> => {
    try {
      // 1. Fetch a random MH3 card in English
      const english = (await ScryfallApiInstance.getRandomCard(
        "set:mh3"
      )) as Card;

      if (!english) {
        throw new Error("Failed to fetch English card");
      }

      console.log("Fetched English card:", english.name);

      // 2. Fetch the Spanish version by name
      const searchUrl = new URL("https://api.scryfall.com/cards/search");
      searchUrl.searchParams.set("q", `lang:es name:"${english.name}"`);

      const searchRes = await fetch(searchUrl.toString()).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Spanish card: ${res.statusText}`);
        }
        return res.json();
      });

      const spanish =
        searchRes.data && searchRes.data.length > 0 ? searchRes.data[0] : null;

      if (spanish) {
        console.log("Fetched Spanish card:", spanish.name);
      } else {
        console.warn("No Spanish translation found for:", english.name);
      }

      return { english, spanish };
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error; // Re-throw to let Vue Query handle it
    }
  };

  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["random-mh3-card"],
    queryFn: getRandomCard,
    retry: 1, // Only retry once on failure
  });

  const card = computed(() => data.value?.english);
  const cardEs = computed(() => data.value?.spanish);

  return {
    card,
    cardEs,
    refetch,
    isFetching,
    error,
  };
};
