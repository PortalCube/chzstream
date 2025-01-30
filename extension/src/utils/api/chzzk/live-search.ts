import { Chzzk } from "./chzzk.ts";

export type ChzzkLiveSearch = {
  size: number;
  page: {
    next: {
      offset: number;
    };
  } | null;
  data: {
    live: {
      liveTitle: string;
      liveImageUrl: string | null;
      defaultThumbnailImageUrl: string | null;
      concurrentUserCount: number;
      accumulateCount: number;
      openDate: string;
      liveId: number;
      adult: boolean;
      tags: string[];
      chatChannelId: string;
      categoryType: string;
      liveCategory: string;
      liveCategoryValue: string;
      dropsCampaignNo: unknown;
      watchPartyNo: unknown;
      watchPartyTag: unknown;
      channelId: string;
      livePlaybackJson: string;
      blindType: unknown;
    };
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
  }[];
};

export async function getLiveSearch(
  query: string,
  offset: number = 0,
  size: number = 50
) {
  const response = await Chzzk.get<ChzzkLiveSearch>(
    `/service/v1/search/lives`,
    {
      keyword: query,
      offset,
      size,
    }
  );

  return convertLiveSearch(response);
}

export function convertLiveSearch(response: ChzzkLiveSearch) {
  return response.data.map((item) => ({
    live: {
      liveTitle: item.live.liveTitle,
      concurrentUserCount: item.live.concurrentUserCount,
      adult: item.live.adult,
    },
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: convertToVaildString(item.channel.channelImageUrl),
      verifiedMark: item.channel.verifiedMark,
    },
  }));
}
