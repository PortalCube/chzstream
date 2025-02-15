import { isTypedObject } from "@message/util.ts";
import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "@message/messages/base.ts";

const MESSAGE_KEY = "_isHandshakeResponseMessage";

export type HandshakeResponseMessageData = {
  version: string;
  id: number;
};

export type HandshakeResponseMessage = Message & {
  data: {
    [MESSAGE_KEY]: true;
  } & HandshakeResponseMessageData;
};

export function isHandshakeResponseMessage(
  message: unknown
): message is HandshakeResponseMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createHandshakeResponseMessage(
  options: CreateMessageOptions,
  data: HandshakeResponseMessageData
): HandshakeResponseMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      ...data,
    },
  };
}
