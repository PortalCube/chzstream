import { Chzzk } from "@extension/utils/api/chzzk/chzzk.ts";

export type ChzzkLiveInfo = {
  liveId: number;
  liveTitle: string;
  status: "OPEN" | "CLOSE"; // enum
  liveImageUrl: string | null;
  defaultThumbnailImageUrl: string | null;
  concurrentUserCount: number;
  accumulateCount: number;
  openDate: string;
  closeDate: string | null;
  adult: boolean;
  krOnlyViewing: boolean;
  clipActive: boolean;
  tags: string[];
  chatChannelId: string;
  categoryType: string; // enum
  liveCategory: string;
  liveCategoryValue: string;
  chatActive: boolean;
  chatAvailableGroup: string; // enum
  paidPromotion: boolean;
  chatAvailableCondition: string; // enum
  minFollowerMinute: number;
  allowSubscriberInFollowerMode: boolean;
  livePlaybackJson: string; // json string
  p2pQuality: string[]; // enum array
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
    activatedChannelBadgeIds?: string[];
  };
  livePollingStatusJson: string; // json string
  userAdultStatus: "ADULT" | "NOT_LOGIN_USER" | "NOT_REAL_NAME_AUTH" | null; // enum (need more info)
  blindType: unknown;
  chatDonationRankingExposure: boolean;
  adParameter: {
    tag: string; // enum?
  };
  dropsCampaignNo: unknown;
  watchPartyNo: unknown;
  watchPartyTag: unknown;
} | null;

export async function getLiveInfo(uuid: string) {
  const response = await Chzzk.get<ChzzkLiveInfo>(
    `/service/v3/channels/${uuid}/live-detail`
  );

  return convertLiveInfo(response);
}

export function convertLiveInfo(response: ChzzkLiveInfo) {
  if (response === null) {
    return null;
  }

  return {
    liveId: response.liveId,
    liveTitle: response.liveTitle,
    status: response.status,
    liveImageUrl: response.liveImageUrl,
    concurrentUserCount: response.concurrentUserCount,
    openDate: response.openDate,
    adult: response.adult,
    krOnlyViewing: response.krOnlyViewing,
    tags: response.tags,
    categoryType: response.categoryType,
    liveCategory: response.liveCategory,
    liveCategoryValue: response.liveCategoryValue,
    channel: {
      channelId: response.channel.channelId,
      channelName: response.channel.channelName,
      channelImageUrl: convertToVaildString(response.channel.channelImageUrl),
      verifiedMark: response.channel.verifiedMark,
    },
    userAdultStatus: response.userAdultStatus,
  };
}
