import {
  ChzzkSearchLiveOptions,
  ChzzkSearchLiveResponse,
} from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";
import { isAxiosError } from "axios";

export type StreamSearchLiveResponse = (
  | {
      platform: "chzzk";
      next: Exclude<ChzzkSearchLiveOptions["next"], undefined>;
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

export type StreamSearchLiveOptions = (
  | {
      platform: "chzzk";
      next?: ChzzkSearchLiveOptions["next"];
    }
  | {
      platform: "youtube";
    }
) & {
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

  if (options.platform === "chzzk") {
    return searchLiveChzzk.call(this, options);
  } else if (options.platform === "youtube") {
    return searchLiveYoutube.call(this, options);
  }

  throw new Error("Unsupported platform");
}

async function searchLiveChzzk(
  this: StreamClient,
  options: Extract<StreamSearchLiveOptions, { platform: "chzzk" }>
): Promise<StreamSearchLiveResponse> {
  let data: ChzzkSearchLiveResponse | null = null;

  try {
    data = await this.chzzkClient.searchLive(options);
  } catch (err) {
    if (isAxiosError(err) === false) throw err;
    if (err.status !== 400) throw err;
  }

  if (data === null) {
    return {
      platform: "chzzk",
      next: null,
      result: [],
    };
  }

  return {
    platform: "chzzk",
    next: data.content.page?.next ?? null,
    result: data.content.data.map((item) => ({
      platform: "chzzk",
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

async function searchLiveYoutube(
  this: StreamClient,
  options: Extract<StreamSearchLiveOptions, { platform: "youtube" }>
): Promise<StreamSearchLiveResponse> {
  throw new Error("Not implemented");
}
