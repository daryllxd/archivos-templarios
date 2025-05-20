import { defineEventHandler, getQuery } from "h3";

interface GoogleSearchItem {
  link: string;
  title: string;
  snippet?: string;
  mime?: string;
  image?: {
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
  };
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.q as string;

  if (!searchQuery) {
    return { items: [] };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=9`
    );

    const data = (await response.json()) as GoogleSearchResponse;
    return {
      items:
        data.items?.map((item) => ({
          link: item.link,
          title: item.title,
        })) || [],
    };
  } catch (error) {
    console.error("Error searching images:", error);
    return { items: [] };
  }
});
