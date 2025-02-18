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
  }),
  nextSchema
);

export type ChzzkGetLiveListResponse = z.infer<typeof schema>;

export type ChzzkGetLiveListOptions = {
  next?: z.infer<typeof nextSchema> | null;
  size?: number;
};

export async function getLiveList(
  this: ChzzkClient,
  options?: ChzzkGetLiveListOptions | null
): Promise<ChzzkGetLiveListResponse> {
  const { next = null, size = 10 } = options ?? {};

  const params = {
    url: `/service/v1/lives`,
    params: {
      ...next,
      size,
      sortType: "POPULAR",
    },
  };

  const response = await this.get(params);
  return schema.parse(response);
}
