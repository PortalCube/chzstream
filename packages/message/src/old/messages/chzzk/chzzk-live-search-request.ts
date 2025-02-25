import {
  createMessage,
  CreateMessageOptions,
} from "@message/old/messages/base";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "@message/old/messages/chzzk/chzzk";

export type ChzzkLiveSearchRequest = {
  size?: number;
  offset?: number;
  query: string;
};

export type ChzzkLiveSearchRequestMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveSearch;
    messageType: ChzzkServiceMessageType.Request;
  } & ChzzkLiveSearchRequest;
};

export function isChzzkLiveSearchRequestMessage(
  message: unknown
): message is ChzzkLiveSearchRequestMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveSearch) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Request) {
    return false;
  }

  return true;
}

export function createChzzkLiveSearchRequestMessage(
  options: CreateMessageOptions,
  data: ChzzkLiveSearchRequest
): ChzzkLiveSearchRequestMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveSearch,
      messageType: ChzzkServiceMessageType.Request,
      ...data,
    },
  };
}
