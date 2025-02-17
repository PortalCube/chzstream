import { ChzzkClient, responseSchema } from "@api/chzzk/client.ts";
import { z } from "zod";

const schema = z
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
  .nullable();

export type GetLiveStatusResponse = {
  liveTitle: string;
  status: "OPEN" | "CLOSE";
  concurrentUserCount: number;
  openDate: string;
  adult: boolean;
  krOnlyViewing: boolean;
  tags: string[];
  categoryType: string | null;
  liveCategory: string | null;
  liveCategoryValue: string;
  userAdultStatus: "ADULT" | "NOT_LOGIN_USER" | "NOT_REAL_NAME_AUTH" | null;
} | null;

export async function getLiveStatus(
  this: ChzzkClient,
  uuid: string
): Promise<GetLiveStatusResponse> {
  const response = await this.get({
    url: `/polling/v3/channels/${uuid}/live-status`,
  });

  const { content } = responseSchema.parse(response);
  const body = schema.parse(content);

  if (body === null) {
    return null;
  }

  return {
    liveTitle: body.liveTitle,
    status: body.status,
    concurrentUserCount: body.concurrentUserCount,
    openDate: body.openDate,
    adult: body.adult,
    krOnlyViewing: body.krOnlyViewing,
    tags: body.tags,
    categoryType: body.categoryType,
    liveCategory: body.liveCategory,
    liveCategoryValue: body.liveCategoryValue,
    userAdultStatus: body.userAdultStatus,
  };
}
