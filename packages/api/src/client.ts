import axios, { AxiosRequestConfig } from "axios";
import Keyv from "keyv";

const DEFAULT_CACHE_TTL = 1000 * 5;

export type APIClientOptions = {
  baseUrl: string;
  headers: AxiosRequestConfig["headers"];
  ttl?: number;
};

export type APIClientRequestOptions = {
  url: string;
  params?: Record<string, unknown>;
  body?: unknown;
  ttl?: number;
};

export class APIClient {
  #baseUrl: string;
  #client: ReturnType<typeof axios.create>;
  #cache: Keyv;

  constructor(options: APIClientOptions) {
    this.#baseUrl = options.baseUrl;
    this.#cache = new Keyv({ ttl: options.ttl ?? DEFAULT_CACHE_TTL });
    this.#client = axios.create({
      baseURL: options.baseUrl,
      headers: options.headers,
    });
  }

  async get(options: APIClientRequestOptions): Promise<unknown> {
    const cache = await this.getCacheValue(options);
    if (cache !== undefined) return cache;

    const response = await this.#client.get<unknown>(options.url, {
      params: options.params,
    });

    await this.setCacheValue(options, response.data);

    return response.data;
  }

  async post(options: APIClientRequestOptions): Promise<unknown> {
    const response = await this.#client.post<unknown>(
      options.url,
      options.body,
      {
        params: options.params,
      }
    );

    return response.data;
  }

  getCacheKey(options: APIClientRequestOptions): string {
    const url = new URL(this.#baseUrl + options.url);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.set(key, value as string);
      });
    }

    return url.toString();
  }

  async getCacheValue(
    options: APIClientRequestOptions
  ): Promise<unknown | undefined> {
    const key = this.getCacheKey(options);
    return await this.#cache.get(key);
  }

  async setCacheValue(
    options: APIClientRequestOptions,
    value: unknown
  ): Promise<void> {
    const key = this.getCacheKey(options);
    const ttl = options.ttl === undefined ? this.#cache.ttl : options.ttl;

    if (ttl !== undefined && ttl >= 0) {
      await this.#cache.set(key, value, ttl);
    }
  }
}
