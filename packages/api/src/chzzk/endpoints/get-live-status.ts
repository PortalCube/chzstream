import { createResponseSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";

const schema = createResponseSchema(
  z
    .object({
      liveTitle: z.string(),
      status: z.enum(["OPEN", "CLOSE"]),
      concurrentUserCount: z.number(),
      accumulateCount: z.number(),
      paidPromotion: z.boolean(),
      adult: z.boolean(),
      krOnlyViewing: z.boolean(),
      openDate: z.string(),
      closeDate: z.string().nullable(),
      clipActive: z.boolean(),
      chatChannelId: z.string().nullable(),
      tags: z.string().array(),
      categoryType: z.string().nullable(),
      liveCategory: z.string().nullable(),
      liveCategoryValue: z.string(),
      livePollingStatusJson: z.string(),
      faultStatus: z.unknown(),
      userAdultStatus: z
        .enum(["ADULT", "NOT_LOGIN_USER", "NOT_REAL_NAME_AUTH"])
        .nullable(),
      blindType: z.unknown(),
      playerRecommendContent: z.object({
        categoryLives: z.array(z.unknown()),
        channelLatestVideos: z.array(z.unknown()),
      }),
      chatActive: z.boolean(),
      chatAvailableGroup: z.string(),
      chatAvailableCondition: z.string(),
      minFollowerMinute: z.number(),
      allowSubscriberInFollowerMode: z.boolean(),
      chatDonationRankingExposure: z.boolean(),
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
