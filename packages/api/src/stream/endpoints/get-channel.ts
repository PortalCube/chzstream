import { Platform, StreamClient } from "@api/stream/client.ts";
import {
  YoutubeGetChannelResponse,
  YoutubeGetPlaylistItemsResponse,
  YoutubeGetVideosResponse,
} from "@api/youtube";
import { isAxiosError } from "axios";

export type StreamGetChannelResponse = {
  platform: Platform;
  channelId: string;
  channelName: string;
  channelDescription: string;
  channelImageUrl: string | null;
  channelFollower: number;
  channelVerified: boolean;
  liveId: string | null;
  liveStatus: boolean;
  liveTitle: string | null;
  liveThumbnailUrl: string | null;
  liveViewer: number;
} | null;

export type StreamGetChannelOptions =
  | {
      platform: "chzzk";
      id: string;
    }
  | {
      platform: "youtube";
      type: "id" | "handle" | "video";
      value: string;
    };

export async function getChannel(
  this: StreamClient,
  options: StreamGetChannelOptions
): Promise<StreamGetChannelResponse> {
  if (options.platform === "chzzk") {
    return getChannelChzzk.call(this, options);
  } else if (options.platform === "youtube") {
    return getChannelYoutube.call(this, options);
  }

  throw new Error("Unsupported platform");
}

async function getChannelChzzk(
  this: StreamClient,
  options: Extract<StreamGetChannelOptions, { platform: "chzzk" }>
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
    liveId: null,
    liveStatus: data.content.openLive,
    liveTitle: null,
    liveThumbnailUrl: null,
    liveViewer: 0,
  };

  const liveData = await this.chzzkClient.getLive(options.id);

  if (liveData.content !== null) {
    response.liveId = liveData.content.liveId.toString();
    response.liveTitle = liveData.content.liveTitle;
    response.liveThumbnailUrl = liveData.content.liveImageUrl;
    response.liveViewer = liveData.content.concurrentUserCount;
  }

  return response;
}

type YoutubeGetVideoItem = YoutubeGetVideosResponse["items"][number];

async function getYoutubeStream(
  this: StreamClient,
  playlistId: string
): Promise<YoutubeGetVideoItem | null> {
  let playlistResponse: YoutubeGetPlaylistItemsResponse | null = null;

  try {
    playlistResponse = await this.youtubeClient.getPlaylistItems({
      id: playlistId,
      size: 50,
    });
  } catch (err) {
    if (isAxiosError(err) === false) throw err;
    if (err.status !== 404) throw err;
  }

  if (playlistResponse === null) {
    return null;
  }

  const videoIds = playlistResponse.items.map(
    (item) => item.contentDetails.videoId
  );

  const videoResponse = await this.youtubeClient.getVideos(videoIds);

  const dateSort = (a: YoutubeGetVideoItem, b: YoutubeGetVideoItem) =>
    new Date(a.liveStreamingDetails!.scheduledStartTime!).valueOf() -
    new Date(b.liveStreamingDetails!.scheduledStartTime!).valueOf();

  // 진행 중인 라이브 스트림
  const liveStreams = videoResponse.items
    .filter((item) => item.snippet.liveBroadcastContent === "live")
    .sort(dateSort);

  // 예정된 라이브 스트림
  const upcomingStreams = videoResponse.items
    .filter((item) => item.snippet.liveBroadcastContent === "upcoming")
    .sort(dateSort);

  // 종료된 라이브 스트림
  const endedStreams = videoResponse.items
    .filter(
      (item) =>
        item.snippet.liveBroadcastContent === "none" &&
        item.liveStreamingDetails !== undefined
    )
    .sort(dateSort);

  if (liveStreams.length > 0) {
    return liveStreams.pop()!;
  } else if (upcomingStreams.length > 0) {
    return upcomingStreams.shift()!;
  } else if (endedStreams.length > 0) {
    return endedStreams.pop()!;
  }

  return null;
}

async function getChannelYoutube(
  this: StreamClient,
  options: Extract<StreamGetChannelOptions, { platform: "youtube" }>
): Promise<StreamGetChannelResponse> {
  if (options.type === "video") {
    return getChannelYoutubeWithVideo.call(this, options);
  }

  const { type, value } = options;

  let channelResponse: YoutubeGetChannelResponse | null = null;

  try {
    channelResponse = await this.youtubeClient.getChannel({
      type,
      value,
    });
  } catch (err) {
    if (isAxiosError(err) === false) throw err;
    if (err.status !== 404) throw err;
  }

  if (channelResponse === null) {
    return null;
  }

  if (channelResponse.pageInfo.totalResults === 0) {
    return null;
  }

  const channel = channelResponse.items![0];
  const uploadPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

  const stream = await getYoutubeStream.call(this, uploadPlaylistId);
  const viewer = stream?.liveStreamingDetails?.concurrentViewers ?? 0; // TODO

  return {
    platform: "youtube",
    channelId: channel.id,
    channelName: channel.snippet.title,
    channelDescription: channel.snippet.description,
    channelImageUrl: channel.snippet.thumbnails.medium.url,
    channelFollower: Number(channel.statistics.subscriberCount),
    channelVerified: false,
    liveId: stream?.id ?? null,
    liveStatus: stream?.snippet?.liveBroadcastContent === "live",
    liveTitle: stream?.snippet.title ?? null,
    liveThumbnailUrl:
      stream?.snippet.thumbnails.maxres?.url ??
      stream?.snippet.thumbnails.default?.url ??
      null,
    liveViewer: Number(viewer),
  };
}

async function getChannelYoutubeWithVideo(
  this: StreamClient,
  options: Extract<StreamGetChannelOptions, { platform: "youtube" }>
): Promise<StreamGetChannelResponse> {
  const videoResponse = await this.youtubeClient.getVideos([options.value]);

  if (videoResponse.items.length === 0) {
    return null;
  }

  const video = videoResponse.items[0];

  const channelResponse = await this.youtubeClient.getChannel({
    type: "id",
    value: video.snippet.channelId,
  });

  if (
    channelResponse.items === undefined ||
    channelResponse.items.length === 0
  ) {
    return null;
  }

  const channel = channelResponse.items[0];

  return {
    platform: "youtube",
    channelId: channel?.id ?? video.snippet.channelId,
    channelName: channel?.snippet.title ?? video.snippet.channelTitle,
    channelDescription: channel?.snippet.description ?? "",
    channelImageUrl:
      channel?.snippet.thumbnails.medium.url ??
      video.snippet.thumbnails.medium.url ??
      null,
    channelFollower: Number(channel?.statistics.subscriberCount ?? 0),
    channelVerified: false,
    liveId: video.id,
    liveStatus: video.snippet.liveBroadcastContent === "live",
    liveTitle: video.snippet.title,
    liveThumbnailUrl:
      video.snippet.thumbnails.maxres?.url ??
      video.snippet.thumbnails.default?.url ??
      null,
    liveViewer: Number(video.liveStreamingDetails?.concurrentViewers ?? 0),
  };
}
