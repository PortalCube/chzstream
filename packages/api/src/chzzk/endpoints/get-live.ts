import { createResponseSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";
import { def } from "@api/error.ts";

const schema = createResponseSchema(
  z
    .object({
      liveId: z.number().catch(def(0)),
      liveTitle: z.string().catch(def("알 수 없음")),
      status: z.enum(["OPEN", "CLOSE"]).catch(def("CLOSE" as const)),
      liveImageUrl: z.string().nullable().catch(def(null)),
      defaultThumbnailImageUrl: z.string().nullable().catch(def(null)),
      concurrentUserCount: z.number().catch(def(0)),
      accumulateCount: z.number().catch(def(0)),
      openDate: z.string().catch(def("")),
      closeDate: z.string().nullable().catch(def(null)),
      adult: z.boolean().catch(def(false)),
      krOnlyViewing: z.boolean().catch(def(false)),
      clipActive: z.boolean().catch(def(false)),
      tags: z.string().array().catch(def([])),
      chatChannelId: z.string().nullable().catch(def(null)),
      categoryType: z.string().nullable().catch(def(null)),
      liveCategory: z.string().nullable().catch(def(null)),
      liveCategoryValue: z.string().catch(def("")),
      chatActive: z.boolean().catch(def(false)),
      chatAvailableGroup: z.string().catch(def("")),
      paidPromotion: z.boolean().catch(def(false)),
      chatAvailableCondition: z.string().catch(def("")),
      minFollowerMinute: z.number().catch(def(0)),
      allowSubscriberInFollowerMode: z.boolean().catch(def(false)),
      livePlaybackJson: z.string().nullable().catch(def(null)),
      p2pQuality: z.string().array().nullable().catch(def(null)),
      channel: z.object({
        channelId: z.string().catch(def("")),
        channelName: z.string().catch(def("알 수 없음")),
        channelImageUrl: z.string().nullable().catch(def(null)),
        verifiedMark: z.boolean().catch(def(false)),
        activatedChannelBadgeIds: z.string().array().optional().catch(def([])),
      }),
      livePollingStatusJson: z.string().catch(def("")),
      userAdultStatus: z
        .enum(["ADULT", "NOT_LOGIN_USER", "NOT_REAL_NAME_AUTH"])
        .nullable()
        .catch(def(null)),
      blindType: z.unknown(),
      chatDonationRankingExposure: z.boolean().catch(def(false)),
      adParameter: z
        .object({
          tag: z.string(),
        })
        .catch(def({ tag: "" })),
      dropsCampaignNo: z.unknown(),
      watchPartyNo: z.unknown(),
      watchPartyTag: z.unknown(),
    })
    .nullable()
);

export type ChzzkGetLiveResponse = z.infer<typeof schema>;

export async function getLive(
  this: ChzzkClient,
  uuid: string
): Promise<ChzzkGetLiveResponse> {
  const params = {
    url: `/service/v3/channels/${uuid}/live-detail`,
  };

  const response = await this.get(params);
  return schema.parse(response);
}
