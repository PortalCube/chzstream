import { APIClient } from "@api/client.ts";
import { z } from "zod";

export const Client = new APIClient<Response>(
  "https://api.chzzk.naver.com",
  handler
);

function handler(response: unknown): Response {
  const res = responseSchema.parse(response);

  return res;
}

export type Response = {
  code: number;
  message: string | null;
  content?: unknown;
};

export const responseSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  content: z.unknown(),
});

export const paginationSchema = z.object({
  size: z.number(),
  page: z
    .object({
      next: z.object({
        offset: z.number(),
      }),
    })
    .nullable(),
  data: z.array(z.unknown()),
});

export const livePaginationSchema = z.object({
  size: z.number(),
  page: z
    .object({
      next: z.object({
        concurrentUserCount: z.number(),
        liveId: z.number(),
      }),
    })
    .nullable(),
  data: z.array(z.unknown()),
});
