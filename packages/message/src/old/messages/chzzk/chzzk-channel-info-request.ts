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

export type ChzzkChannelInfoRequest = {
  uuid: string;
};

export type ChzzkChannelInfoRequestMessage = ChzzkServiceMessage & {
  data: {
    serviceType: ChzzkServiceType.ChannelInfo;
    messageType: ChzzkServiceMessageType.Request;
  } & ChzzkChannelInfoRequest;
};

export function isChzzkChannelInfoRequestMessage(
  message: unknown
): message is ChzzkChannelInfoRequestMessage {
  if (isChzzkServiceMessage(message) === false) {
    return false;
  }

  if (message.data.serviceType !== ChzzkServiceType.ChannelInfo) {
    return false;
  }

  if (message.data.messageType !== ChzzkServiceMessageType.Request) {
    return false;
  }

  return true;
}

export function createChzzkChannelInfoRequestMessage(
  options: CreateMessageOptions,
  data: ChzzkChannelInfoRequest
): ChzzkChannelInfoRequestMessage {
  return {
    ...createMessage(options),
    data: {
      _isChzzkServiceMessage: true,
      serviceType: ChzzkServiceType.ChannelInfo,
      messageType: ChzzkServiceMessageType.Request,
      ...data,
    },
  };
}
