import { ChzzkGetLiveListOptions } from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamGetLiveListResponse = {
  platform: Platform.Chzzk;
  next: Exclude<ChzzkGetLiveListOptions["next"], undefined>;
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

export type StreamGetLiveListOptions = {
  platform: Platform.Chzzk;
  next?: ChzzkGetLiveListOptions["next"];
} & {
  size?: number;
};

export async function getLiveList(
  this: StreamClient,
  options: StreamGetLiveListOptions
): Promise<StreamGetLiveListResponse> {
  if (options.platform === Platform.Chzzk) {
    return getLiveListChzzk.call(this, options);
  }

  throw new Error(`Unsupported platform: ${options.platform}`);
}

async function getLiveListChzzk(
  this: StreamClient,
  options: StreamGetLiveListOptions
): Promise<StreamGetLiveListResponse> {
  const data = await this.chzzkClient.getLiveList(options);

  return {
    platform: Platform.Chzzk,
    next: data.content.page?.next ?? null,
    result: data.content.data.map((item) => ({
      platform: Platform.Chzzk,
      channelId: item.channel.channelId,
      channelName: item.channel.channelName,
      channelImageUrl: item.channel.channelImageUrl,
      channelVerified: item.channel.verifiedMark,
      liveTitle: item.liveTitle,
      liveThumbnailUrl: item.liveImageUrl,
      liveViewer: item.concurrentUserCount,
    })),
  };
}
