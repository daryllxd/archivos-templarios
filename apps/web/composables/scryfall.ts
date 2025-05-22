// apps/web/composables/scryfall.ts

class Http {
  async fetch<T>(url: string | URL): Promise<T> {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Network error");
    return response.json();
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ScryfallApiHttp extends Http {
  private rateLimitPromise = Promise.resolve();

  async fetch<T>(url: string | URL) {
    await this.rateLimitPromise;
    const response = super.fetch<T>(url);
    this.rateLimitPromise = response.then(() => wait(50)).catch(() => wait(50));
    return response;
  }
}

export class ScryfallApi {
  constructor(private readonly http: Http = new ScryfallApiHttp()) {}

  async getRandomCard(query: string) {
    const url = new URL("https://api.scryfall.com/cards/random");
    url.searchParams.set("q", query);
    return this.http.fetch(url);
  }
}

export const ScryfallApiInstance = new ScryfallApi();
