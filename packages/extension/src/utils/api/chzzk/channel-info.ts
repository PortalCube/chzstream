import { convertToVaildString } from "@extension/utils/util.ts";
import { Chzzk } from "@extension/utils/api/chzzk/chzzk.ts";

export type ChzzkChannelInfo = {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
  verifiedMark: boolean;
  channelType: string; // enum
  channelDescription: string;
  followerCount: number;
  openLive: boolean;
  subscriptionAvailability: boolean;
  subscriptionPaymentAvailability: {
    iapAvailability: boolean;
    iabAvailability: boolean;
  };
  adMonetizationAvailability: boolean;
  activatedChannelBadgeIds?: string[];
} | null;

export async function getChannelInfo(uuid: string) {
  const response = await Chzzk.get<ChzzkChannelInfo>(
    `/service/v1/channels/${uuid}`,
    {},
    1000 * 10
  );
  return convertChannelInfo(response);
}

export function convertChannelInfo(response: ChzzkChannelInfo) {
  if (response === null) {
    return null;
  }

  return {
    channelId: response.channelId,
    channelName: response.channelName,
    channelImageUrl: convertToVaildString(response.channelImageUrl),
    verifiedMark: response.verifiedMark,
    channelDescription: response.channelDescription,
    followerCount: response.followerCount,
    openLive: response.openLive,
  };
}
