import { ChzzkClient } from "@api/chzzk/client.ts";
import { createPaginationSchema } from "@api/chzzk/schema.ts";
import { def } from "@api/error.ts";
import { z } from "zod";

const nextSchema = z
  .object({
    offset: z.number(),
  })
  .catch(
    def({
      offset: 0,
    })
  );

const schema = createPaginationSchema(
  z.object({
    live: z.object({
      liveTitle: z.string().catch(def("알 수 없음")),
      liveImageUrl: z.string().nullable().catch(def(null)),
      defaultThumbnailImageUrl: z.string().nullable().catch(def(null)),
      concurrentUserCount: z.number().catch(def(0)),
      accumulateCount: z.number().catch(def(0)),
      openDate: z.string().catch(def("")),
      liveId: z.number().catch(def(0)),
      adult: z.boolean().catch(def(false)),
      tags: z.string().array().catch(def([])),
      chatChannelId: z.string().nullable().catch(def(null)),
      categoryType: z.string().nullable().catch(def(null)),
      liveCategory: z.string().nullable().catch(def(null)),
      liveCategoryValue: z.string().catch(def("")),
      dropsCampaignNo: z.unknown(),
      watchPartyNo: z.unknown(),
      watchPartyTag: z.unknown(),
      channelId: z.string().catch(def("")),
      livePlaybackJson: z.string().nullable().catch(def(null)),
      blindType: z.unknown(),
    }),
    channel: z.object({
      channelId: z.string().catch(def("")),
      channelName: z.string().catch(def("알 수 없음")),
      channelImageUrl: z.string().nullable().catch(def(null)),
      verifiedMark: z.boolean().catch(def(false)),
      activatedChannelBadgeIds: z.string().array().optional().catch(def([])),
      personalData: z
        .object({
          privateUserBlock: z.boolean(),
        })
        .optional()
        .catch(def(undefined)),
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
