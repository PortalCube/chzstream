import { ChzzkClient } from "@api/chzzk/client.ts";
import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { def } from "@api/error.ts";
import { z } from "zod";

const nextSchema = z
  .object({
    concurrentUserCount: z.number(),
    liveId: z.number(),
  })
  .catch(
    def({
      concurrentUserCount: 0,
      liveId: 0,
    })
  );

const schema = createPaginationSchema(
  z.object({
    liveId: z.number().catch(def(0)),
    liveTitle: z.string().catch(def("알 수 없음")),
    liveImageUrl: z.string().nullable().catch(def(null)),
    defaultThumbnailImageUrl: z.string().nullable().catch(def(null)),
    concurrentUserCount: z.number().catch(def(0)),
    accumulateCount: z.number().catch(def(0)),
    openDate: z.string().nullable().catch(def(null)),
    adult: z.boolean().catch(def(false)),
    tags: z.string().array().catch(def([])),
    categoryType: z.string().nullable().catch(def(null)),
    liveCategory: z.string().nullable().catch(def(null)),
    liveCategoryValue: z.string().catch(def("")),
    dropsCampaignNo: z.unknown(),
    watchPartyNo: z.unknown(),
    watchPartyTag: z.unknown(),
    channel: z.object({
      channelId: z.string().catch(def("")),
      channelName: z.string().catch(def("알 수 없음")),
      channelImageUrl: z.string().nullable().catch(def(null)),
      verifiedMark: z.boolean().catch(def(false)),
      activatedChannelBadgeIds: z
        .string()
        .array()
        .optional()
        .catch(def(undefined)),
      personalData: z
        .object({
          privateUserBlock: z.boolean(),
        })
        .optional()
        .catch(def(undefined)),
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
