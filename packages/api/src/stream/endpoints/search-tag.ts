import {
  ChzzkSearchTagOptions,
  ChzzkSearchTagResponse,
} from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";
import { isAxiosError } from "axios";

export type StreamSearchTagResponse = (
  | {
      platform: "chzzk";
      next: Exclude<ChzzkSearchTagOptions["next"], undefined>;
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

export type StreamSearchTagOptions = (
  | {
      platform: "chzzk";
      next?: ChzzkSearchTagOptions["next"];
    }
  | { platform: "youtube" }
) & {
  query: string;
  size?: number;
};

export async function searchTag(
  this: StreamClient,
  options: StreamSearchTagOptions
): Promise<StreamSearchTagResponse> {
  options = {
    size: 10,
    ...options,
  };

  if (options.platform === "chzzk") {
    return searchTagChzzk.call(this, options);
  } else if (options.platform === "youtube") {
    return searchTagYoutube.call(this, options);
  }

  throw new Error("Unsupported platform");
}

async function searchTagChzzk(
  this: StreamClient,
  options: Extract<StreamSearchTagOptions, { platform: "chzzk" }>
): Promise<StreamSearchTagResponse> {
  let data: ChzzkSearchTagResponse | null = null;

  try {
    data = await this.chzzkClient.searchTag(options);
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
      liveTitle: item.liveTitle,
      liveThumbnailUrl: item.liveImageUrl,
      liveViewer: item.concurrentUserCount,
    })),
  };
}

async function searchTagYoutube(
  this: StreamClient,
  options: Extract<StreamSearchTagOptions, { platform: "youtube" }>
): Promise<StreamSearchTagResponse> {
  throw new Error("Not implemented");
}
