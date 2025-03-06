import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "@message/messages/base.ts";
import { isTypedObject } from "@message/util.ts";

const MESSAGE_KEY = "_isPlayerControlMessage";

export type PlayerControlMessageData = {
  quality?: number;
  volume?: number;
  muted?: boolean;
};

export type PlayerControlMessage = Message<
  typeof MESSAGE_KEY,
  PlayerControlMessageData
>;

export function isPlayerControlMessage(
  message: unknown
): message is PlayerControlMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createPlayerControlMessage(
  options: CreateMessageOptions,
  data: PlayerControlMessageData
): PlayerControlMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      ...data,
    },
  };
}
