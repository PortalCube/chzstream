import { createMessage, CreateMessageOptions } from "@message/messages/base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "@message/messages/chzzk/chzzk.ts";

export type ChzzkLiveListRequest = {
  size?: number;
  offset?: {
    id: number;
    count: number;
  };
};

export type ChzzkLiveListRequestMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveList;
    messageType: ChzzkServiceMessageType.Request;
  } & ChzzkLiveListRequest;
};

export function isChzzkLiveListRequestMessage(
  message: unknown
): message is ChzzkLiveListRequestMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveList) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Request) {
    return false;
  }

  return true;
}

export function createChzzkLiveListRequestMessage(
  options: CreateMessageOptions,
  data: ChzzkLiveListRequest
): ChzzkLiveListRequestMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveList,
      messageType: ChzzkServiceMessageType.Request,
      ...data,
    },
  };
}
