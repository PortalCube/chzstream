import { createMessage, CreateMessageOptions } from "../base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "./chzzk.ts";

export type ChzzkChannelSearchRequest = {
  size?: number;
  offset?: number;
  query: string;
};

export type ChzzkChannelSearchRequestMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.ChannelSearch;
    messageType: ChzzkServiceMessageType.Request;
  } & ChzzkChannelSearchRequest;
};

export function isChzzkChannelSearchRequestMessage(
  message: unknown
): message is ChzzkChannelSearchRequestMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.ChannelSearch) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Request) {
    return false;
  }

  return true;
}

export function createChzzkChannelSearchRequestMessage(
  options: CreateMessageOptions,
  data: ChzzkChannelSearchRequest
): ChzzkChannelSearchRequestMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.ChannelSearch,
      messageType: ChzzkServiceMessageType.Request,
      ...data,
    },
  };
}
