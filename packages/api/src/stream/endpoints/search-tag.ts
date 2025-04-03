import { ChzzkSearchTagOptions } from "@api/chzzk/index.ts";
import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamSearchTagResponse = {
  platform: "chzzk";
  next: Exclude<ChzzkSearchTagOptions["next"], undefined>;
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

export type StreamSearchTagOptions = {
  platform: "chzzk";
  next?: ChzzkSearchTagOptions["next"];
} & {
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
  }

  throw new Error(`Unsupported platform: ${options.platform}`);
}

async function searchTagChzzk(
  this: StreamClient,
  options: StreamSearchTagOptions
): Promise<StreamSearchTagResponse> {
  const data = await this.chzzkClient.searchTag(options);

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
