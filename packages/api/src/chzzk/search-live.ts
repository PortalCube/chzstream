import {
  ChzzkClient,
  paginationSchema,
  responseSchema,
} from "@api/chzzk/client.ts";
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
      chatChannelId: z.string().nullable(),
      categoryType: z.string().nullable(),
      liveCategory: z.string().nullable(),
      liveCategoryValue: z.string(),
      dropsCampaignNo: z.unknown(),
      watchPartyNo: z.unknown(),
      watchPartyTag: z.unknown(),
      channelId: z.string(),
      livePlaybackJson: z.string().nullable(),
      blindType: z.unknown(),
    }),
    channel: z.object({
      channelId: z.string(),
      channelName: z.string(),
      channelImageUrl: z.string().nullable(),
      verifiedMark: z.boolean(),
      activatedChannelBadgeIds: z.string().array().optional(),
      personalData: z
        .object({
          privateUserBlock: z.boolean(),
        })
        .optional(),
    }),
  })
);

export type SearchLiveResponse = {
  next: number | null;
  data: {
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
};

export async function searchLive(
  this: ChzzkClient,
  query: string,
  offset: number | null = 0,
  size: number = 50
): Promise<SearchLiveResponse> {
  const response = await this.get({
    url: `/service/v1/search/lives`,
    params: {
      keyword: query,
      offset,
      size,
    },
  });

  const { content } = responseSchema.parse(response);
  const { data, page } = paginationSchema.parse(content);
  const list = schema.parse(data);

  return {
    next: page?.next.offset ?? null,
    data: list.map((item) => ({
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
    })),
  };
}
