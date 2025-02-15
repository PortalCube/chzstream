import { v4 as uuid } from "uuid";
import { isTypedObject } from "@message/util.ts";

export enum ReceiverType {
  All = "all",
  Extension = "extension",
  AllWebsite = "all_website",
  AllIframe = "all_iframe",
}

export type Receiver = ReceiverType | number | number[];

export enum MessageType {
  Request = "request",
  Response = "response",
}

const MESSAGE_KEY = "_isChzstreamMessage";

export type Message = {
  [MESSAGE_KEY]: true;
  id: string;
  sender: number | null;
  receiver: Receiver;
  type?: MessageType;
  data: unknown;
};

export type CreateMessageOptions = {
  id?: string;
  sender: number | null;
  receiver: Receiver;
  type?: MessageType;
};

export function isMessage(message: unknown): message is Message {
  if (isTypedObject(message, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createMessage(options: CreateMessageOptions): Message {
  return {
    [MESSAGE_KEY]: true,
    id: options.id ?? uuid(),
    sender: options.sender,
    receiver: options.receiver,
    data: null,
  };
}
