import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "@message/old/messages/base";

const MESSAGE_KEY = "_isHeartbeatMessage";

export type HeartbeatMessage = Message<typeof MESSAGE_KEY, {}>;

export function isHeartbeatMessage(
  message: unknown
): message is HeartbeatMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createHeartbeatMessage(
  options: CreateMessageOptions
): HeartbeatMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
    },
  };
}
