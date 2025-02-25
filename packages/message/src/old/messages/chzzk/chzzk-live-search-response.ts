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

export type ChzzkLiveSearchResponse = {
  live: {
    liveTitle: string;
    concurrentUserCount: number;
    adult: boolean;
  };
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
}[];

export type ChzzkLiveSearchResponseMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveSearch;
    messageType: ChzzkServiceMessageType.Response;
    body: ChzzkLiveSearchResponse;
  };
};

export function isChzzkLiveSearchResponseMessage(
  message: unknown
): message is ChzzkLiveSearchResponseMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveSearch) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Response) {
    return false;
  }

  return true;
}

export function createChzzkLiveSearchResponseMessage(
  options: CreateMessageOptions,
  body: ChzzkLiveSearchResponse
): ChzzkLiveSearchResponseMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveSearch,
      messageType: ChzzkServiceMessageType.Response,
      body,
    },
  };
}
