import { isTypedObject } from "@message/util.ts";
import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "@message/old/messages/base";

const MESSAGE_KEY = "_isHandshakeIframeMessage";

export type HandshakeIframeMessageData = {
  iframeId: number;
};

export type HandshakeIframeMessage = Message & {
  data: {
    [MESSAGE_KEY]: true;
  } & HandshakeIframeMessageData;
};

export function isHandshakeIframeMessage(
  message: unknown
): message is HandshakeIframeMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createHandshakeIframeMessage(
  options: CreateMessageOptions,
  data: HandshakeIframeMessageData
): HandshakeIframeMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      ...data,
    },
  };
}
