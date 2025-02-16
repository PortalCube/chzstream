import { Client, livePaginationSchema } from "@api/chzzk/client.ts";
import { paginationSchema } from "@api/chzzk/client.ts";
import { normalizeString } from "@api/util.ts";
import { z } from "zod";

const schema = z.array(
  z.object({
    liveId: z.number(),
    liveTitle: z.string(),
    liveImageUrl: z.string().nullable(),
    defaultThumbnailImageUrl: z.string().nullable(),
    concurrentUserCount: z.number(),
    accumulateCount: z.number(),
    openDate: z.string().nullable(),
    adult: z.boolean(),
    tags: z.array(z.string()),
    categoryType: z.string(),
    liveCategory: z.string(),
    liveCategoryValue: z.string(),
    dropsCampaignNo: z.unknown(),
    watchPartyNo: z.unknown(),
    watchPartyTag: z.unknown(),
    channel: z.object({
      channelId: z.string(),
      channelName: z.string(),
      channelImageUrl: z.string().nullable(),
      verifiedMark: z.boolean(),
      activatedChannelBadgeIds: z.array(z.string()),
      personalData: z.object({
        privateUserBlock: z.boolean(),
      }),
    }),
    blindType: z.unknown(),
  })
);

export type GetLiveListResponse = {
  liveId: number;
  liveTitle: string;
  concurrentUserCount: number;
  adult: boolean;
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
}[];

export async function getLiveList(
  offset: {
    id: number;
    count: number;
  } | null = null,
  size: number = 50
): Promise<GetLiveListResponse> {
  const response = await Client.get(`/service/v1/lives`, {
    liveId: offset?.id ?? undefined,
    concurrentUserCount: offset?.count ?? undefined,
    size,
    sortType: "POPULAR",
  });

  const pageResult = livePaginationSchema.parse(response.content);
  const list = schema.parse(pageResult.data);

  return list.map((item) => ({
    liveId: item.liveId,
    liveTitle: item.liveTitle,
    concurrentUserCount: item.concurrentUserCount,
    adult: item.adult,
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: normalizeString(item.channel.channelImageUrl),
      verifiedMark: item.channel.verifiedMark,
    },
  }));
}
