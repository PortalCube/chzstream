import { ChzzkClient, responseSchema } from "@api/chzzk/client.ts";
import { normalizeString } from "@api/util.ts";
import { z } from "zod";

const schema = z
  .object({
    liveId: z.number(),
    liveTitle: z.string(),
    status: z.enum(["OPEN", "CLOSE"]), // enum
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
  .nullable();

export type GetLiveResponse = {
  liveId: number;
  liveTitle: string;
  status: "OPEN" | "CLOSE"; // enum
  liveImageUrl: string | null;
  concurrentUserCount: number;
  openDate: string;
  adult: boolean;
  krOnlyViewing: boolean;
  tags: string[];
  categoryType: string | null; // enum
  liveCategory: string | null;
  liveCategoryValue: string;
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
  userAdultStatus: "ADULT" | "NOT_LOGIN_USER" | "NOT_REAL_NAME_AUTH" | null;
} | null;

export async function getLive(
  this: ChzzkClient,
  uuid: string
): Promise<GetLiveResponse> {
  const response = await this.get({
    url: `/service/v3/channels/${uuid}/live-detail`,
  });

  const { content } = responseSchema.parse(response);
  const body = schema.parse(content);

  if (body === null) {
    return null;
  }

  return {
    liveId: body.liveId,
    liveTitle: body.liveTitle,
    status: body.status,
    liveImageUrl: body.liveImageUrl,
    concurrentUserCount: body.concurrentUserCount,
    openDate: body.openDate,
    adult: body.adult,
    krOnlyViewing: body.krOnlyViewing,
    tags: body.tags,
    categoryType: body.categoryType,
    liveCategory: body.liveCategory,
    liveCategoryValue: body.liveCategoryValue,
    channel: {
      channelId: body.channel.channelId,
      channelName: body.channel.channelName,
      channelImageUrl: normalizeString(body.channel.channelImageUrl),
      verifiedMark: body.channel.verifiedMark,
    },
    userAdultStatus: body.userAdultStatus,
  };
}
