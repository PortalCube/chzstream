import axios from "axios";
import Keyv from "keyv";

const DEFAULT_CACHE_TTL = 1000 * 5;

function getUrlString(baseUrl: string, params: Record<string, unknown>) {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value as string);
  });

  return url.toString();
}

export class APIClient<T extends Record<string, unknown>> {
  #baseUrl: string;
  #client: ReturnType<typeof axios.create>;
  #cache: Keyv<T>;
  #handler: (response: unknown) => T;

  constructor(
    baseUrl: string,
    responseHandler: (response: unknown) => T,
    ttl: number = DEFAULT_CACHE_TTL
  ) {
    this.#baseUrl = baseUrl;
    this.#handler = responseHandler;
    this.#cache = new Keyv<T>({ ttl });
    this.#client = axios.create({ baseURL: baseUrl });
  }

  async get(
    url: string,
    params: Record<string, unknown> = {},
    ttl: number | null = null
  ): Promise<T> {
    const key = getUrlString(this.#baseUrl + url, params);
    const cache = await this.#cache.get(key);

    if (cache !== undefined) {
      return cache;
    }

    const response = await this.#client.get<unknown>(url, {
      params,
    });

    const data = this.#handler(response.data);

    if (ttl !== null && ttl >= 0) {
      await this.#cache.set(key, data, ttl);
    }

    return data;
  }

  async post(url: string, body: unknown): Promise<T> {
    const response = await this.#client.post<unknown>(url, body);

    const data = this.#handler(response.data);

    return data;
  }
}
