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

export type ChzzkLiveInfoResponse = {
  liveId: number;
  liveTitle: string;
  status: "OPEN" | "CLOSE";
  liveImageUrl: string | null;
  concurrentUserCount: number;
  openDate: string;
  adult: boolean;
  krOnlyViewing: boolean;
  tags: string[];
  categoryType: string;
  liveCategory: string;
  liveCategoryValue: string;
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    verifiedMark: boolean;
  };
  userAdultStatus: "ADULT" | "NOT_LOGIN_USER" | "NOT_REAL_NAME_AUTH" | null; // enum (need more info)
} | null;

export type ChzzkLiveInfoResponseMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveInfo;
    messageType: ChzzkServiceMessageType.Response;
    body: ChzzkLiveInfoResponse | null;
  };
};

export function isChzzkLiveInfoResponseMessage(
  message: unknown
): message is ChzzkLiveInfoResponseMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveInfo) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Response) {
    return false;
  }

  return true;
}

export function createChzzkLiveInfoResponseMessage(
  options: CreateMessageOptions,
  body: ChzzkLiveInfoResponse
): ChzzkLiveInfoResponseMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveInfo,
      messageType: ChzzkServiceMessageType.Response,
      body,
    },
  };
}
