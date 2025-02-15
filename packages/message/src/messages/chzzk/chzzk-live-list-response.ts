import { createMessage, CreateMessageOptions } from "@message/messages/base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "@message/messages/chzzk/chzzk.ts";

export type ChzzkLiveListResponse = {
  liveId: number;
  liveTitle: string;
  concurrentUserCount: number;
  adult: boolean;
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
}[];

export type ChzzkLiveListResponseMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveList;
    messageType: ChzzkServiceMessageType.Response;
    body: ChzzkLiveListResponse;
  };
};

export function isChzzkLiveListResponseMessage(
  message: unknown
): message is ChzzkLiveListResponseMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveList) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Response) {
    return false;
  }

  return true;
}

export function createChzzkLiveListResponseMessage(
  options: CreateMessageOptions,
  body: ChzzkLiveListResponse
): ChzzkLiveListResponseMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveList,
      messageType: ChzzkServiceMessageType.Response,
      body,
    },
  };
}
