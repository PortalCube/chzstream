import { isMessage, Message } from "@message/messages/base.ts";
import { isTypedObject } from "@message/util.ts";

const MESSAGE_KEY = "_isChzzkServiceMessage";

export enum ChzzkServiceType {
  ChannelInfo = "channel-info",
  ChannelSearch = "channel-search",
  LiveInfo = "live-info",
  LiveSearch = "live-search",
  LiveList = "live-list",
}

export enum ChzzkServiceMessageType {
  Request = "request",
  Response = "response",
}

export type ChzzkServiceMessageData = {
  serviceType: ChzzkServiceType;
  messageType: ChzzkServiceMessageType;
};

export type ChzzkServiceMessage = Message<
  typeof MESSAGE_KEY,
  ChzzkServiceMessageData
>;

export function isChzzkServiceMessage(
  message: unknown
): message is ChzzkServiceMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}
