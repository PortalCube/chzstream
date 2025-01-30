import { Chzzk } from "./chzzk.ts";

export type ChzzkLiveList = {
  size: number;
  page: {
    next: {
      offset: number;
    };
  } | null;
  data: {
    liveId: number;
    liveTitle: string;
    liveImageUrl: string | null;
    defaultThumbnailImageUrl: string | null;
    concurrentUserCount: number;
    accumulateCount: number;
    openDate: string | null;
    adult: boolean;
    tags: string[];
    categoryType: string;
    liveCategory: string;
    liveCategoryValue: string;
    dropsCampaignNo: unknown;
    watchPartyNo: unknown;
    watchPartyTag: unknown;
    channel: {
      channelId: string;
      channelName: string;
      channelImageUrl: string | null;
      verifiedMark: boolean;
      activatedChannelBadgeIds: string[];
      personalData: {
        privateUserBlock: boolean;
      };
    };
    blindType: unknown;
  }[];
};

export async function getLiveList(
  offset: {
    id: number;
    count: number;
  } | null = null,
  size: number = 50
) {
  const response = await Chzzk.get<ChzzkLiveList>(`/service/v1/lives`, {
    liveId: offset?.id ?? undefined,
    concurrentUserCount: offset?.count ?? undefined,
    size,
    sortType: "POPULAR",
  });

  return convertLiveList(response);
}

export function convertLiveList(response: ChzzkLiveList) {
  return response.data.map((item) => ({
    liveId: item.liveId,
    liveTitle: item.liveTitle,
    concurrentUserCount: item.concurrentUserCount,
    adult: item.adult,
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: convertToVaildString(item.channel.channelImageUrl),
      verifiedMark: item.channel.verifiedMark,
    },
  }));
}
