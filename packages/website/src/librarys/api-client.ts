import {
  StreamGetChannelOptions,
  StreamGetChannelResponse,
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
