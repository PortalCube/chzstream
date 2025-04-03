import { ChzzkClient } from "@api/chzzk/client.ts";
import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { z } from "zod";

const nextSchema = z.object({
  concurrentUserCount: z.number(),
  liveId: z.number(),
});

const schema = createPaginationSchema(
  z.object({
    liveId: z.number(),
    liveTitle: z.string(),
    liveImageUrl: z.string().nullable(),
    defaultThumbnailImageUrl: z.string().nullable(),
    concurrentUserCount: z.number(),
    accumulateCount: z.number(),
    openDate: z.string(),
    adult: z.boolean(),
    tags: z.string().array(),
    categoryType: z.string().nullable(),
    liveCategory: z.string().nullable(),
    liveCategoryValue: z.string(),
    dropsCampaignNo: z.unknown(),
    watchPartyNo: z.unknown(),
    watchPartyTag: z.unknown(),
    blindType: z.unknown(),
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

export type ChzzkSearchTagResponse = z.infer<typeof schema>;

export type ChzzkSearchTagOptions = {
  query: string;
  next?: z.infer<typeof nextSchema> | null;
  size?: number;
};

export async function searchTag(
  this: ChzzkClient,
  options: ChzzkSearchTagOptions
): Promise<ChzzkSearchTagResponse> {
  const { query, next, size = 10 } = options;

  const params = {
    url: `/service/v1/tag/lives`,
    params: {
      ...next,
      tags: query,
      size,
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
