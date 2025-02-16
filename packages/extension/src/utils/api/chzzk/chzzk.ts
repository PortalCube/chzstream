import axios from "axios";
import Keyv from "keyv";

const DEFAULT_CACHE_TTL = 1000 * 5;
const BASE_URL = "https://api.chzzk.naver.com";

export const cache = new Keyv<unknown>({ ttl: DEFAULT_CACHE_TTL });

function createClient() {
  return axios.create({
    baseURL: BASE_URL,
  });
}

export type ChzzkResponse = {
  code: number;
  message: string | null;
  content: unknown;
};

function getCacheKey(url: string, params: Record<string, unknown>) {
  const urlObject = new URL(BASE_URL + url);
  for (const key in params) {
    urlObject.searchParams.set(key, params[key] as string);
  }
  return urlObject.toString();
}

async function get<T>(
  url: string,
  params: Record<string, unknown> = {},
  ttl: number = DEFAULT_CACHE_TTL
): Promise<T> {
  const key = getCacheKey(url, params);

  if (await cache.has(key)) {
    return (await cache.get(key)) as T;
  }

  const client = createClient();
  const { data } = await client.get<ChzzkResponse>(url, {
    params,
  });

  if (data.code !== 200) {
    console.error("치지직 API 요청에 실패했습니다.", data);
    throw new Error(data.message ?? "치지직 API 요청에 실패했습니다.");
  }

  if (ttl > 0) {
    await cache.set(key, data.content, ttl);
  }

  return data.content as T;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const client = createClient();
  const { data } = await client.post<ChzzkResponse>(url, body);

  if (data.code !== 200) {
    console.error("치지직 API 요청에 실패했습니다.", data);
    throw new Error(data.message ?? "치지직 API 요청에 실패했습니다.");
  }

  return data.content as T;
}

export const Chzzk = {
  get,
  post,
};
