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
    // 1. Fetch a random MH3 card in English
    const english = (await ScryfallApiInstance.getRandomCard(
      "set:mh3"
    )) as Card;
    // 2. Fetch the Spanish version by name
    const searchUrl = new URL("https://api.scryfall.com/cards/search");
    searchUrl.searchParams.set("q", `lang:es name:"${english.name}"`);
    const searchRes = await fetch(searchUrl.toString()).then((res) =>
      res.json()
    );
    const spanish =
      searchRes.data && searchRes.data.length > 0 ? searchRes.data[0] : null;
    return { english, spanish };
  };

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["random-mh3-card"],
    queryFn: getRandomCard,
  });

  const card = computed(() => data.value?.english);
  const cardEs = computed(() => data.value?.spanish);

  return {
    card,
    cardEs,
    refetch,
    isFetching,
  };
};
