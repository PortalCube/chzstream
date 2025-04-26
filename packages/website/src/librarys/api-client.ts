import {
  StreamGetChannelOptions,
  StreamGetChannelResponse,
  StreamGetLiveListOptions,
  StreamGetLiveListResponse,
  StreamSearchChannelOptions,
  StreamSearchChannelResponse,
  StreamSearchLiveOptions,
  StreamSearchLiveResponse,
  StreamSearchTagOptions,
  StreamSearchTagResponse,
} from "@api/index.ts";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { BlockChannel } from "@web/librarys/block.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import axios from "axios";
import { atom } from "jotai";

const workerClient = axios.create({
  baseURL: import.meta.env.VITE_CLOUDFLARE_WORKER_URL,
});

export const fetchStreamChannelAtom = atom(
  null,
  async (
    get,
    _set,
    options: StreamGetChannelOptions
  ): Promise<StreamGetChannelResponse> => {
    const messageClient = get(messageClientAtom);

    // Youtube는 애플리케이션 API Key를 사용해야 하므로 반드시 worker를 사용해야 함
    if (options.platform === "youtube") {
      const response = await workerClient.get(
        `/youtube/channel/${options.type}/${options.value}`
      );
      const body = response.data.body as StreamGetChannelResponse;
      return body;
    }

    // 제한 모드
    if (messageClient === null) {
      const response = await workerClient.get(
        `/${options.platform}/channel/${options.id}`
      );
      const body = response.data.body as StreamGetChannelResponse;
      return body;
    }

    // 확장 프로그램으로 요청
    const response = await messageClient.request("stream-get-channel", options);
    return response.data;
  }
);

export const fetchStreamLiveListAtom = atom(
  null,
  async (
    get,
    _set,
    options: StreamGetLiveListOptions
  ): Promise<StreamGetLiveListResponse> => {
    const messageClient = get(messageClientAtom);

    // Youtube는 애플리케이션 API Key를 사용해야 하므로 반드시 worker를 사용해야 함
    if (options.platform === "youtube") {
      throw new Error("Youtube live list not supported");
    }

    // 제한 모드
    if (messageClient === null) {
      const response = await workerClient.get(`/${options.platform}/live`, {
        params: {
          next: options.next,
          size: options.size,
        },
      });
      const body = response.data.body as StreamGetLiveListResponse;
      return body;
    }

    // 확장 프로그램으로 요청
    const response = await messageClient.request(
      "stream-get-live-list",
      options
    );
    return response.data;
  }
);

export const searchStreamChannelAtom = atom(
  null,
  async (
    get,
    _set,
    options: StreamSearchChannelOptions
  ): Promise<StreamSearchChannelResponse> => {
    const messageClient = get(messageClientAtom);

    // Youtube는 애플리케이션 API Key를 사용해야 하므로 반드시 worker를 사용해야 함
    if (options.platform === "youtube") {
      throw new Error("Youtube search channel not supported");
    }

    // 제한 모드
    if (messageClient === null) {
      const response = await workerClient.get(
        `/${options.platform}/search/channel`,
        {
          params: {
            query: options.query,
            size: options.size,
          },
        }
      );
      const body = response.data.body as StreamSearchChannelResponse;
      return body;
    }

    // 확장 프로그램으로 요청
    const response = await messageClient.request(
      "stream-search-channel",
      options
    );
    return response.data;
  }
);

export const searchStreamTagAtom = atom(
  null,
  async (
    get,
    _set,
    options: StreamSearchTagOptions
  ): Promise<StreamSearchTagResponse> => {
    const messageClient = get(messageClientAtom);

    // Youtube는 애플리케이션 API Key를 사용해야 하므로 반드시 worker를 사용해야 함
    if (options.platform === "youtube") {
      throw new Error("Youtube search tag not supported");
    }

    // 제한 모드
    if (messageClient === null) {
      const response = await workerClient.get(
        `/${options.platform}/search/tag`,
        {
          params: {
            query: options.query,
            size: options.size,
          },
        }
      );
      const body = response.data.body as StreamSearchTagResponse;
      return body;
    }

    // 확장 프로그램으로 요청
    const response = await messageClient.request("stream-search-tag", options);
    return response.data;
  }
);

export const searchStreamLiveAtom = atom(
  null,
  async (
    get,
    _set,
    options: StreamSearchLiveOptions
  ): Promise<StreamSearchLiveResponse> => {
    const messageClient = get(messageClientAtom);

    // Youtube는 애플리케이션 API Key를 사용해야 하므로 반드시 worker를 사용해야 함
    if (options.platform === "youtube") {
      throw new Error("Youtube search live not supported");
    }

    // 제한 모드
    if (messageClient === null) {
      const response = await workerClient.get(
        `/${options.platform}/search/live`,
        {
          params: {
            query: options.query,
            size: options.size,
          },
        }
      );
      const body = response.data.body as StreamSearchLiveResponse;
      return body;
    }

    // 확장 프로그램으로 요청
    const response = await messageClient.request("stream-search-live", options);
    return response.data;
  }
);

export const fetchBlockChannelAtom = atom(
  null,
  async (_get, set, options: StreamGetChannelOptions) => {
    const response = await set(fetchStreamChannelAtom, options);
    if (response === null) {
      if (options.platform === "youtube") {
        throw new Error(
          `Youtube channel not found: (${options.type}) ${options.value}`
        );
      }

      if (options.platform === "chzzk") {
        throw new Error(`Chzzk channel not found: ${options.id}`);
      }

      throw new Error(`Channel not found`);
    }

    const channel: BlockChannel = {
      platform: response.platform,
      channelId: response.channelId,
      channelName: response.channelName,
      channelImageUrl: getProfileImageUrl(response.channelImageUrl),
      liveId: response.liveId,
      liveStatus: response.liveStatus,
      liveTitle: "현재 오프라인 상태입니다",
      liveThumbnailUrl: "",
      lastUpdate: Date.now(),
    };

    if (response.platform === "chzzk") {
      if (response.liveStatus === true) {
        channel.liveTitle = response.liveTitle ?? "";
      }

      if (response.liveThumbnailUrl !== null) {
        const imageUrl = response.liveThumbnailUrl.replace("{type}", "1080");
        channel.liveThumbnailUrl = imageUrl + `?t=${channel.lastUpdate}`;
      }
    } else if (response.platform === "youtube") {
      if (response.liveTitle) {
        channel.liveTitle = response.liveTitle;
      }

      if (response.liveThumbnailUrl) {
        channel.liveThumbnailUrl =
          response.liveThumbnailUrl + `?t=${channel.lastUpdate}`;
      }
    }

    return channel;
  }
);
