import { ChzzkGetLiveListOptions } from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamGetLiveListResponse = (
  | {
      platform: "chzzk";
      next: Exclude<ChzzkGetLiveListOptions["next"], undefined>;
    }
  | { platform: "youtube" }
) & {
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

export type StreamGetLiveListOptions = (
  | {
      platform: "chzzk";
      next?: ChzzkGetLiveListOptions["next"];
    }
  | { platform: "youtube" }
) & {
  size?: number;
};

export async function getLiveList(
  this: StreamClient,
  options: StreamGetLiveListOptions
): Promise<StreamGetLiveListResponse> {
  if (options.platform === "chzzk") {
    return getLiveListChzzk.call(this, options);
  } else if (options.platform === "youtube") {
    return getLiveListYoutube.call(this, options);
  }

  throw new Error("Unsupported platform");
}

async function getLiveListChzzk(
  this: StreamClient,
  options: Extract<StreamGetLiveListOptions, { platform: "chzzk" }>
): Promise<StreamGetLiveListResponse> {
  const data = await this.chzzkClient.getLiveList(options);

  return {
    platform: "chzzk",
    next: data.content.page?.next ?? null,
    result: data.content.data.map((item) => ({
      platform: "chzzk",
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

async function getLiveListYoutube(
  this: StreamClient,
  options: Extract<StreamGetLiveListOptions, { platform: "youtube" }>
): Promise<StreamGetLiveListResponse> {
  throw new Error("Not implemented");
}
