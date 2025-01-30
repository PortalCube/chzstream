import { isTypedObject } from "../../util.ts";
import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "../base.ts";

const MESSAGE_KEY = "_isPlayerEventMessage";

export type PlayerEventMessageData = {
  event: PlayerEventType;
  iframeId: number;
};

export type PlayerEventMessage = Message & {
  data: {
    [MESSAGE_KEY]: true;
  } & PlayerEventMessageData;
};

export enum PlayerEventType {
  Loading = "loading",
  Ready = "ready",
  Begin = "begin",
  End = "end",
  Adult = "adult",
  Error = "error",
}

export function isPlayerEventMessage(
  message: unknown
): message is PlayerEventMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createPlayerEventMessage(
  options: CreateMessageOptions,
  data: PlayerEventMessageData
): PlayerEventMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      ...data,
    },
  };
}
