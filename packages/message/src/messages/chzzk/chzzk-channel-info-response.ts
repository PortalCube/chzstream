import { createMessage, CreateMessageOptions } from "@message/messages/base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "@message/messages/chzzk/chzzk.ts";

export type ChzzkChannelInfoResponse = {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
  verifiedMark: boolean;
  channelDescription: string;
  followerCount: number;
  openLive: boolean;
};

export type ChzzkChannelInfoResponseMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.ChannelInfo;
    messageType: ChzzkServiceMessageType.Response;
    body: ChzzkChannelInfoResponse | null;
  };
};

export function isChzzkChannelInfoResponseMessage(
  message: unknown
): message is ChzzkChannelInfoResponseMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.ChannelInfo) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Response) {
    return false;
  }

  return true;
}

export function createChzzkChannelInfoResponseMessage(
  options: CreateMessageOptions,
  body: ChzzkChannelInfoResponse | null
): ChzzkChannelInfoResponseMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.ChannelInfo,
      messageType: ChzzkServiceMessageType.Response,
      body,
    },
  };
}
