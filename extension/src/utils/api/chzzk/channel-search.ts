import { convertToVaildString } from "@/utils/util.ts";
import { Chzzk } from "./chzzk.ts";

export type ChzzkChannelSearch = {
  size: number;
  page: {
    next: {
      offset: number;
    };
  } | null;
  data: {
    channel: {
      channelId: string;
      channelName: string;
      channelImageUrl: string | null;
      verifiedMark: boolean;
      channelDescription: string;
      followerCount: number;
      openLive: boolean;
      personalData: {
        following: {
          following: boolean;
          notification: boolean;
          followDate: string | null;
        };
        privateUserBlock: boolean;
      };
    };
  }[];
};

export async function getChannelSearch(
  query: string,
  offset: number = 0,
  size: number = 50
) {
  const response = await Chzzk.get<ChzzkChannelSearch>(
    `/service/v1/search/channels`,
    {
      keyword: query,
      offset,
      size,
    }
  );

  return convertChannelSearch(response);
}

export function convertChannelSearch(response: ChzzkChannelSearch) {
  return response.data.map((item) => ({
    channel: {
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: convertToVaildString(item.channel.channelImageUrl),
      channelDescription: item.channel.channelDescription,
      followerCount: item.channel.followerCount,
      openLive: item.channel.openLive,
      verifiedMark: item.channel.verifiedMark,
    },
  }));
}
