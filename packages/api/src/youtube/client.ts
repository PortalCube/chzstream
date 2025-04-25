import { APIClient, APIClientOptions } from "@api/client.ts";

import { getChannel } from "@api/youtube/endpoints/get-channel.ts";
import { getPlaylistItems } from "@api/youtube/endpoints/get-playlist-items.ts";
import { getVideos } from "@api/youtube/endpoints/get-video-list.ts";
import { search } from "@api/youtube/endpoints/search.ts";

export type YoutubeClientOptions =
  | (Omit<APIClientOptions, "baseUrl"> & {
      googleApiKey?: string;
    })
  | null;

export class YoutubeClient extends APIClient {
  constructor(options?: YoutubeClientOptions) {
    // 유튜브 API Key를 헤더에 추가
    const headers = options?.headers ?? {};
    if (options?.googleApiKey !== undefined) {
      headers["X-goog-api-key"] = options.googleApiKey;
    }

    super({
      ...options,
      headers,
      baseUrl: "https://www.googleapis.com/youtube/v3",
    });
  }

  getChannel = getChannel;
  getPlaylistItems = getPlaylistItems;
  getVideos = getVideos;
  search = search;
}
