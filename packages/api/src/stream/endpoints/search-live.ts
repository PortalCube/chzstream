import { ChzzkSearchLiveOptions } from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamSearchLiveResponse = {
  platform: Platform.Chzzk;
  next: Exclude<ChzzkSearchLiveOptions["next"], undefined>;
} & {
  result: {
    platform: Platform;
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    channelVerified: boolean;
    liveTitle: string | null;
    liveThumbnailUrl: string | null;
    liveViewer: number;
  }[];
};

export type StreamSearchLiveOptions = {
  platform: Platform.Chzzk;
  next?: ChzzkSearchLiveOptions["next"];
} & {
  query: string;
  size?: number;
};

export async function searchLive(
  this: StreamClient,
  options: StreamSearchLiveOptions
): Promise<StreamSearchLiveResponse> {
  options = {
    size: 10,
    ...options,
  };

  if (options.platform === Platform.Chzzk) {
    return searchLiveChzzk.call(this, options);
  }

  throw new Error(`Unsupported platform: ${options.platform}`);
}

async function searchLiveChzzk(
  this: StreamClient,
  options: StreamSearchLiveOptions
): Promise<StreamSearchLiveResponse> {
  const data = await this.chzzkClient.searchLive(options);

  return {
    platform: Platform.Chzzk,
    next: data.content.page?.next ?? null,
    result: data.content.data.map((item) => ({
      platform: Platform.Chzzk,
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: item.channel.channelImageUrl,
      channelVerified: item.channel.verifiedMark,
      liveTitle: item.live.liveTitle,
      liveThumbnailUrl: item.live.liveImageUrl,
      liveViewer: item.live.concurrentUserCount,
    })),
  };
}
