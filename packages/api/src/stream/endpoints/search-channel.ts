import { ChzzkSearchChannelOptions } from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamSearchChannelResponse = {
  platform: "chzzk";
  next: Exclude<ChzzkSearchChannelOptions["next"], undefined>;
} & {
  result: {
    platform: Platform;
    channelId: string;
    channelName: string;
    channelDescription: string;
    channelImageUrl: string | null;
    channelVerified: boolean;
    channelFollower: number;
    liveStatus: boolean;
  }[];
};

export type StreamSearchChannelOptions = {
  platform: "chzzk";
  next?: ChzzkSearchChannelOptions["next"];
} & {
  query: string;
  size?: number;
};

export async function searchChannel(
  this: StreamClient,
  options: StreamSearchChannelOptions
): Promise<StreamSearchChannelResponse> {
  options = {
    size: 10,
    ...options,
  };

  if (options.platform === "chzzk") {
    return searchChannelChzzk.call(this, options);
  }

  throw new Error(`Unsupported platform: ${options.platform}`);
}

async function searchChannelChzzk(
  this: StreamClient,
  options: StreamSearchChannelOptions
): Promise<StreamSearchChannelResponse> {
  const data = await this.chzzkClient.searchChannel(options);

  return {
    platform: "chzzk",
    next: data.content.page?.next ?? null,
    result: data.content.data.map((item) => ({
      platform: "chzzk",
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelDescription: item.channel.channelDescription,
      channelImageUrl: item.channel.channelImageUrl,
      channelVerified: item.channel.verifiedMark,
      channelFollower: item.channel.followerCount,
      liveStatus: item.channel.openLive,
    })),
  };
}
