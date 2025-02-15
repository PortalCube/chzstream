import { ClientType, MESSAGE_VERSION } from "@message/clients/base.ts";
import { isTypedObject } from "@message/util.ts";
import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "@message/messages/base.ts";

const MESSAGE_KEY = "_isHandshakeRequestMessage";

export type HandshakeRequestMessageData = {
  version: string;
  type: ClientType;
};

export type HandshakeRequestMessage = Message & {
  data: {
    [MESSAGE_KEY]: true;
  } & HandshakeRequestMessageData;
};

export function isHandshakeRequestMessage(
  message: unknown
): message is HandshakeRequestMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createHandshakeRequestMessage(
  options: CreateMessageOptions,
  type: ClientType
): HandshakeRequestMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      version: MESSAGE_VERSION,
      type,
    },
  };
}
