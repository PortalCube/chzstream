import { RequestMessage, ResponseMessage } from "@message/messages/base.ts";
import {
  PayloadType,
  RequestPayload,
  ResponsePayload,
} from "@message/messages/payload/payload.ts";
export type ClientId =
  | {
      id: string;
      type: "background";
    }
  | {
      id: string;
      type: "website";
    }
  | {
      id: string;
      type: "content";
      websiteId: string;
      blockId: number;
    };

export const BACKGROUND_CLIENT_ID: string =
  "00000000-0000-0000-0000-000000000000";

export type MessageClientId =
  | string
  | { type: "background" }
  | { type: "website"; id: string }
  | { type: "content"; websiteId: string; blockId: string };

export type MessageListener<T extends PayloadType> = (
  message: RequestMessage<T>
) => void;

export type ListenerItem<T extends PayloadType> = {
  listener: MessageListener<T>;
  once: boolean;
};

export type ListenerMap = Partial<{
  [T in PayloadType]: ListenerItem<T>[];
}>;

export interface ClientBase {
  readonly id: ClientId;

  on<T extends PayloadType>(type: T, listener: MessageListener<T>): void;

  remove<T extends PayloadType>(type: T, listener: MessageListener<T>): void;

  send<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient?: MessageClientId
  ): void;

  reply<T extends PayloadType>(
    reply: string,
    type: T,
    data: ResponsePayload<T>,
    recipient: MessageClientId
  ): void;

  request<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient?: MessageClientId
  ): Promise<ResponseMessage<T>>;
}

export const browser: typeof chrome = (() => {
  if (globalThis === null || globalThis === undefined) {
    throw new Error(
      "globalThis is not defined. This browser may not be supported."
    );
  }

  // @ts-expect-error Whale Only
  if (globalThis.whale !== undefined) return globalThis.whale;

  // @ts-expect-error Firefox, Safari Only
  if (globalThis.browser !== undefined) return globalThis.browser;

  // Chromium Only
  if (globalThis.chrome === undefined) return globalThis.chrome;

  throw new Error(
    "Browser API is not available. This browser may not be supported."
  );
})();
