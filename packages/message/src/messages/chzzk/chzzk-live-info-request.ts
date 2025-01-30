import { createMessage, CreateMessageOptions } from "../base.ts";
import {
  ChzzkServiceMessage,
  ChzzkServiceMessageType,
  ChzzkServiceType,
  isChzzkServiceMessage,
} from "./chzzk.ts";

export type ChzzkLiveInfoRequest = {
  uuid: string;
};

export type ChzzkLiveInfoRequestMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.LiveInfo;
    messageType: ChzzkServiceMessageType.Request;
  } & ChzzkLiveInfoRequest;
};

export function isChzzkLiveInfoRequestMessage(
  message: unknown
): message is ChzzkLiveInfoRequestMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.LiveInfo) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Request) {
    return false;
  }

  return true;
}

export function createChzzkLiveInfoRequestMessage(
  options: CreateMessageOptions,
  data: ChzzkLiveInfoRequest
): ChzzkLiveInfoRequestMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.LiveInfo,
      messageType: ChzzkServiceMessageType.Request,
      ...data,
    },
  };
}
