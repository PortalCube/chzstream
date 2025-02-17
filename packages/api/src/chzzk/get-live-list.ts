import {
  ChzzkClient,
  livePaginationSchema,
  responseSchema,
} from "@api/chzzk/client.ts";
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
    tags: z.string().array(),
    categoryType: z.string().nullable(),
    liveCategory: z.string().nullable(),
    liveCategoryValue: z.string(),
    dropsCampaignNo: z.unknown(),
    watchPartyNo: z.unknown(),
    watchPartyTag: z.unknown(),
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
    blindType: z.unknown(),
  })
);

export type GetLiveListResponse = {
  next: {
    concurrentUserCount: number;
    liveId: number;
  } | null;
  data: {
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
};

export async function getLiveList(
  this: ChzzkClient,
  offset: GetLiveListResponse["next"] = null,
  size: number = 50
): Promise<GetLiveListResponse> {
  const response = await this.get({
    url: `/service/v1/lives`,
    params: {
      liveId: offset?.liveId ?? undefined,
      concurrentUserCount: offset?.concurrentUserCount ?? undefined,
      size,
      sortType: "POPULAR",
    },
  });

  const { content } = responseSchema.parse(response);
  const { page, data } = livePaginationSchema.parse(content);
  const list = schema.parse(data);

  return {
    next: page?.next ?? null,
    data: list.map((item) => ({
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
    })),
  };
}
