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

export type StreamGetChannelOptions =
  | {
      platform: "chzzk";
      id: string;
    }
  | {
      platform: "youtube";
      type: "id" | "handle"; // | "video";
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

async function getChannelYoutube(
  this: StreamClient,
  options: Extract<StreamGetChannelOptions, { platform: "youtube" }>
): Promise<StreamGetChannelResponse> {
  const channelResponse = await this.youtubeClient.getChannel({
    type: options.type,
    value: options.value,
  });

  if (channelResponse.items.length === 0) {
    return null;
  }

  const channel = channelResponse.items[0];
  const uploadPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

  const playlistResponse = await this.youtubeClient.getPlaylistItems({
    id: uploadPlaylistId,
    size: 50,
  });

  const videoIds = playlistResponse.items.map(
    (item) => item.contentDetails.videoId
  );

  const videoResponse = await this.youtubeClient.getVideos(videoIds);

  let stream: (typeof videoResponse.items)[0] | null = null; // TODO

  // 진행 중인 라이브 스트림
  const liveStreams = videoResponse.items
    .filter((item) => item.snippet.liveBroadcastContent === "live")
    .sort(
      (a, b) =>
        // 가장 나중에 시작한 라이브를 가져오기
        new Date(b.liveStreamingDetails!.actualStartTime!).valueOf() -
        new Date(a.liveStreamingDetails!.actualStartTime!).valueOf()
    );

  // 예정된 라이브 스트림
  const upcomingStreams = videoResponse.items
    .filter((item) => item.snippet.liveBroadcastContent === "upcoming")
    .sort(
      (a, b) =>
        // 가장 먼저 시작할 라이브를 가져오기
        new Date(a.liveStreamingDetails!.scheduledStartTime!).valueOf() -
        new Date(b.liveStreamingDetails!.scheduledStartTime!).valueOf()
    );

  // 종료된 라이브 스트림
  const endedStreams = videoResponse.items
    .filter(
      (item) =>
        item.snippet.liveBroadcastContent === "none" &&
        item.liveStreamingDetails !== undefined
    )
    .sort(
      (a, b) =>
        // 가장 나중에 시작한 라이브를 가져오기
        new Date(b.liveStreamingDetails!.actualStartTime!).valueOf() -
        new Date(a.liveStreamingDetails!.actualStartTime!).valueOf()
    );

  if (liveStreams.length > 0) {
    stream = liveStreams[0];
  } else if (upcomingStreams.length > 0) {
    stream = upcomingStreams[0];
  } else if (endedStreams.length > 0) {
    stream = endedStreams[0];
  }

  const viewer = stream?.liveStreamingDetails?.concurrentViewers ?? 0; // TODO

  return {
    platform: "youtube",
    channelId: channel.id,
    channelName: channel.snippet.title,
    channelDescription: channel.snippet.description,
    channelImageUrl: channel.snippet.thumbnails.medium.url,
    channelFollower: Number(channel.statistics.subscriberCount),
    channelVerified: false,
    liveStatus: stream?.snippet?.liveBroadcastContent === "live",
    liveTitle: stream?.snippet.title ?? null,
    liveThumbnailUrl:
      stream?.snippet.thumbnails.maxres?.url ??
      stream?.snippet.thumbnails.default?.url ??
      null,
    liveViewer: Number(viewer),
  };
}
