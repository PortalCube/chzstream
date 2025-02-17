import { APIClient, APIClientOptions } from "@api/client.ts";
import { z } from "zod";

import { getLive } from "@api/chzzk/get-live.ts";
import { getLiveList } from "@api/chzzk/get-live-list.ts";
import { getLiveStatus } from "@api/chzzk/get-live-status.ts";
import { getChannel } from "@api/chzzk/get-channel.ts";
import { searchLive } from "@api/chzzk/search-live.ts";
import { searchChannel } from "@api/chzzk/search-channel.ts";

export type ChzzkClientOptions = Omit<APIClientOptions, "baseUrl"> | null;

export class ChzzkClient extends APIClient {
  constructor(options: ChzzkClientOptions) {
    super({ ...options, baseUrl: "http://api.chzzk.naver.com" });
  }

  getLive = getLive;
  getLiveList = getLiveList;
  getLiveStatus = getLiveStatus;
  getChannel = getChannel;
  searchLive = searchLive;
  searchChannel = searchChannel;
}

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
