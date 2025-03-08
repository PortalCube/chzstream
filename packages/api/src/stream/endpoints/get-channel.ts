import { Platform, StreamClient } from "@api/stream/client.ts";

export type StreamGetChannelResponse = {
  platform: Platform;
  channelId: string;
  channelName: string;
  channelDescription: string;
  channelImageUrl: string | null;
  channelFollower: number;
  channelVerified: boolean;
  liveStatus: boolean;
  liveTitle: string | null;
  liveThumbnailUrl: string | null;
  liveViewer: number;
} | null;

export type StreamGetChannelOptions = {
  platform: Platform;
  id: string;
};

export async function getChannel(
  this: StreamClient,
  options: StreamGetChannelOptions
): Promise<StreamGetChannelResponse> {
  if (options.platform === "chzzk") {
    return getChannelChzzk.call(this, options);
  }

  throw new Error(`Unsupported platform: ${options.platform}`);
}

async function getChannelChzzk(
  this: StreamClient,
  options: StreamGetChannelOptions
): Promise<StreamGetChannelResponse> {
  const data = await this.chzzkClient.getChannel(options.id);

  if (data.content.channelId === null) {
    return null;
  }

  const response: StreamGetChannelResponse = {
    platform: "chzzk",
    channelId: data.content.channelId,
    channelName: data.content.channelName,
    channelDescription: data.content.channelDescription,
    channelImageUrl: data.content.channelImageUrl,
    channelFollower: data.content.followerCount,
    channelVerified: data.content.verifiedMark,
    liveStatus: data.content.openLive,
    liveTitle: null,
    liveThumbnailUrl: null,
    liveViewer: 0,
  };

  const liveData = await this.chzzkClient.getLive(options.id);

  if (liveData.content !== null) {
    response.liveTitle = liveData.content.liveTitle;
    response.liveThumbnailUrl = liveData.content.liveImageUrl;
    response.liveViewer = liveData.content.concurrentUserCount;
  }

  return response;
}
