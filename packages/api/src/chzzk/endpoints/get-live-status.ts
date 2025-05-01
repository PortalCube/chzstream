import { createResponseSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";
import { def } from "@api/error.ts";

const schema = createResponseSchema(
  z
    .object({
      liveTitle: z.string().catch(def("알 수 없음")),
      status: z.enum(["OPEN", "CLOSE"]).catch(def("CLOSE" as const)),
      concurrentUserCount: z.number().catch(def(0)),
      accumulateCount: z.number().catch(def(0)),
      paidPromotion: z.boolean().catch(def(false)),
      adult: z.boolean().catch(def(false)),
      krOnlyViewing: z.boolean().catch(def(false)),
      openDate: z.string().catch(def("")),
      closeDate: z.string().nullable().catch(def(null)),
      clipActive: z.boolean().catch(def(false)),
      chatChannelId: z.string().nullable().catch(def(null)),
      tags: z.string().array().catch(def([])),
      categoryType: z.string().nullable().catch(def(null)),
      liveCategory: z.string().nullable().catch(def(null)),
      liveCategoryValue: z.string().catch(def("")),
      livePollingStatusJson: z.string().catch(def("")),
      faultStatus: z.unknown(),
      userAdultStatus: z
        .enum(["ADULT", "NOT_LOGIN_USER", "NOT_REAL_NAME_AUTH"])
        .nullable()
        .catch(def(null)),
      blindType: z.unknown(),
      playerRecommendContent: z
        .object({
          categoryLives: z.array(z.unknown()),
          channelLatestVideos: z.array(z.unknown()),
        })
        .catch(
          def({
            categoryLives: [],
            channelLatestVideos: [],
          })
        ),
      chatActive: z.boolean().catch(def(false)),
      chatAvailableGroup: z.string().catch(def("")),
      chatAvailableCondition: z.string().catch(def("")),
      minFollowerMinute: z.number().catch(def(0)),
      allowSubscriberInFollowerMode: z.boolean().catch(def(false)),
      chatDonationRankingExposure: z.boolean().catch(def(false)),
      dropsCampaignNo: z.unknown(),
      liveTokenList: z.unknown(),
      watchPartyNo: z.unknown(),
      watchPartyTag: z.unknown(),
    })
    .nullable()
);

export type ChzzkGetLiveStatusResponse = z.infer<typeof schema>;

export async function getLiveStatus(
  this: ChzzkClient,
  uuid: string
): Promise<ChzzkGetLiveStatusResponse> {
  const params = {
    url: `/polling/v3/channels/${uuid}/live-status`,
  };

  const response = await this.get(params);
  return schema.parse(response);
}
