import { createResponseSchema } from "@api/chzzk/schema.ts";
import { ChzzkClient } from "@api/chzzk/client.ts";
import { z } from "zod";

const schema = createResponseSchema(
  z
    .object({
      liveId: z.number(),
      liveTitle: z.string(),
      status: z.enum(["OPEN", "CLOSE"]),
      liveImageUrl: z.string().nullable(),
      defaultThumbnailImageUrl: z.string().nullable(),
      concurrentUserCount: z.number(),
      accumulateCount: z.number(),
      openDate: z.string(),
      closeDate: z.string().nullable(),
      adult: z.boolean(),
      krOnlyViewing: z.boolean(),
      clipActive: z.boolean(),
      tags: z.string().array(),
      chatChannelId: z.string().nullable(),
      categoryType: z.string().nullable(), // enum
      liveCategory: z.string().nullable(),
      liveCategoryValue: z.string(),
      chatActive: z.boolean(),
      chatAvailableGroup: z.string(), // enum
      paidPromotion: z.boolean(),
      chatAvailableCondition: z.string(), // enum
      minFollowerMinute: z.number(),
      allowSubscriberInFollowerMode: z.boolean(),
      livePlaybackJson: z.string().nullable(),
      p2pQuality: z.string().array().nullable(),
      channel: z.object({
        channelId: z.string(),
        channelName: z.string(),
        channelImageUrl: z.string().nullable(),
        verifiedMark: z.boolean(),
        activatedChannelBadgeIds: z.string().array().optional(),
      }),
      livePollingStatusJson: z.string(),
      userAdultStatus: z
        .enum(["ADULT", "NOT_LOGIN_USER", "NOT_REAL_NAME_AUTH"])
        .nullable(), // enum (need more info)
      blindType: z.unknown(),
      chatDonationRankingExposure: z.boolean(),
      adParameter: z.object({
        tag: z.string(), // enum?
      }),
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
