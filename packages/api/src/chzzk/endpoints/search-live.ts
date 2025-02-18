import { ChzzkClient } from "@api/chzzk/client.ts";
import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { z } from "zod";

const nextSchema = z.object({
  offset: z.number(),
});

const schema = createPaginationSchema(
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
  }),
  nextSchema
);

export type ChzzkSearchLiveResponse = z.infer<typeof schema>;

export type ChzzkSearchLiveOptions = {
  query: string;
  next?: z.infer<typeof nextSchema> | null;
  size?: number;
};

export async function searchLive(
  this: ChzzkClient,
  options: ChzzkSearchLiveOptions
): Promise<ChzzkSearchLiveResponse> {
  const { query, next, size = 10 } = options;

  const params = {
    url: `/service/v1/search/lives`,
    params: {
      ...next,
      keyword: query,
      size,
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
