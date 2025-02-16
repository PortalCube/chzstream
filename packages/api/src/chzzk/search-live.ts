import { Client } from "@api/chzzk/client.ts";
import { paginationSchema } from "@api/chzzk/client.ts";
import { normalizeString } from "@api/util.ts";
import { z } from "zod";

const schema = z.array(
  z.object({
    live: z.object({
      liveTitle: z.string(),
      liveImageUrl: z.string().nullable(),
      defaultThumbnailImageUrl: z.string().nullable(),
      concurrentUserCount: z.number(),
      accumulateCount: z.number(),
      openDate: z.string(),
      liveId: z.number(),
      adult: z.boolean(),
      tags: z.string().array(),
      chatChannelId: z.string(),
      categoryType: z.string(),
      liveCategory: z.string(),
      liveCategoryValue: z.string(),
      dropsCampaignNo: z.unknown(),
      watchPartyNo: z.unknown(),
      watchPartyTag: z.unknown(),
      channelId: z.string(),
      livePlaybackJson: z.string(),
      blindType: z.unknown(),
    }),
    channel: z.object({
      channelId: z.string(),
      channelName: z.string(),
      channelImageUrl: z.string().nullable(),
      verifiedMark: z.boolean(),
      activatedChannelBadgeIds: z.string().array(),
      personalData: z.object({
        privateUserBlock: z.boolean(),
      }),
    }),
  })
);

export type SearchLiveResponse = {
  live: {
    liveTitle: string;
    concurrentUserCount: number;
    adult: boolean;
  };
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
}[];

export async function searchLive(
  query: string,
  offset: number = 0,
  size: number = 50
): Promise<SearchLiveResponse> {
  const response = await Client.get(`/service/v1/search/lives`, {
    keyword: query,
    offset,
    size,
  });

  const pageResult = paginationSchema.parse(response.content);
  const list = schema.parse(pageResult.data);

  return list.map((item) => ({
    live: {
      liveTitle: item.live.liveTitle,
      concurrentUserCount: item.live.concurrentUserCount,
      adult: item.live.adult,
    },
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: normalizeString(item.channel.channelImageUrl),
      verifiedMark: item.channel.verifiedMark,
    },
  }));
}
