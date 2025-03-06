import { v4 as uuid } from "uuid";
import { isTypedObject } from "@message/util.ts";

export enum RecipientType {
  All = "all",
  Extension = "extension",
  AllWebsite = "all_website",
  AllIframe = "all_iframe",
}

export type Recipient = RecipientType | number | number[];

const MESSAGE_KEY = "_isChzstreamMessage";

export type MessageBase = {
  [MESSAGE_KEY]: true;
  id: string;
  sender: number | null;
  recipient: Recipient;
  data: unknown;
};

export type Message<Key extends string, Body> = MessageBase & {
  data: {
    [key in Key]: true;
  } & Body;
};

export type CreateMessageOptions = {
  id?: string;
  sender: number | null;
  recipient: Recipient;
};

export function isMessage(message: unknown): message is MessageBase {
  if (isTypedObject(message, MESSAGE_KEY) === false) {
    return false;
  }

  return true;
}

export function createMessage(options: CreateMessageOptions): MessageBase {
  return {
    [MESSAGE_KEY]: true,
    id: options.id ?? uuid(),
    sender: options.sender,
    recipient: options.recipient,
    data: null,
  };
}
