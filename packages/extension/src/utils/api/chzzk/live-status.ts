import { Chzzk } from "@extension/utils/api/chzzk/chzzk.ts";

export type ChzzkLiveStatus = {
  liveTitle: string;
  status: "OPEN" | "CLOSE"; // enum
  concurrentUserCount: number;
  accumulateCount: number;
  paidPromotion: boolean;
  adult: boolean;
  krOnlyViewing: boolean;
  openDate: string;
  closeDate: string | null;
  clipActive: boolean;
  chatChannelId: string;
  tags: string[];
  categoryType: string;
  liveCategory: string;
  liveCategoryValue: string;
  livePollingStatusJson: string; // json string
  faultStatus: unknown; // 정지 사유?
  userAdultStatus: "ADULT" | "NOT_LOGIN_USER" | "NOT_REAL_NAME_AUTH"; // enum (need more info)
  blindType: unknown;
  playerRecommendContent: {
    categoryLives: unknown[];
    channelLatestVideos: unknown[];
  };
  chatActive: boolean;
  chatAvailableGroup: string; // enum
  chatAvailableCondition: string; // enum
  minFollowerMinute: number;
  allowSubscriberInFollowerMode: boolean;
  chatDonationRankingExposure: boolean;
  dropsCampaignNo: unknown;
  liveTokenList: unknown;
  watchPartyNo: unknown;
  watchPartyTag: unknown;
} | null;

export async function getLiveStatus(uuid: string) {
  const response = await Chzzk.get<ChzzkLiveStatus>(
    `/polling/v3/channels/${uuid}/live-status`
  );

  return convertLiveStatus(response);
}

export function convertLiveStatus(response: ChzzkLiveStatus) {
  if (response === null) {
    return null;
  }

  return {
    liveTitle: response.liveTitle,
    status: response.status,
    concurrentUserCount: response.concurrentUserCount,
    openDate: response.openDate,
    adult: response.adult,
    krOnlyViewing: response.krOnlyViewing,
    tags: response.tags,
    categoryType: response.categoryType,
    liveCategory: response.liveCategory,
    liveCategoryValue: response.liveCategoryValue,
    userAdultStatus: response.userAdultStatus,
  };
}
