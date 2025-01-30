import { createMessage, CreateMessageOptions } from "../base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "./chzzk.ts";

export type ChzzkChannelSearchResponse = {
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    channelDescription: string;
    followerCount: number;
    openLive: boolean;
    verifiedMark: boolean;
  };
}[];

export type ChzzkChannelSearchResponseMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.ChannelSearch;
    messageType: ChzzkServiceMessageType.Response;
    body: ChzzkChannelSearchResponse;
  };
};

export function isChzzkChannelSearchResponseMessage(
  message: unknown
): message is ChzzkChannelSearchResponseMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.ChannelSearch) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Response) {
    return false;
  }

  return true;
}

export function createChzzkChannelSearchResponseMessage(
  options: CreateMessageOptions,
  body: ChzzkChannelSearchResponse
): ChzzkChannelSearchResponseMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.ChannelSearch,
      messageType: ChzzkServiceMessageType.Response,
      body,
    },
  };
}
