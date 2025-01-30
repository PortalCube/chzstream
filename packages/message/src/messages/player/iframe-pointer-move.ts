import { isTypedObject } from "../../util.ts";
import {
  createMessage,
  CreateMessageOptions,
  isMessage,
  Message,
} from "../base.ts";

const MESSAGE_KEY = "_isIframePointerMoveMessage";

export type IframePointerMoveMessageData = {
  iframeId: number;
  clientX: number;
  clientY: number;
};

export type IframePointerMoveMessage = Message & {
  data: {
    [MESSAGE_KEY]: true;
  } & IframePointerMoveMessageData;
};

export function isIframePointerMoveMessage(
  message: unknown
): message is IframePointerMoveMessage {
  if (isMessage(message) === false) {
    return false;
  }

  if (isTypedObject(message.data, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createIframePointerMoveMessage(
  options: CreateMessageOptions,
  data: IframePointerMoveMessageData
): IframePointerMoveMessage {
  return {
    ...createMessage(options),
    data: {
      [MESSAGE_KEY]: true,
      ...data,
    },
  };
}
