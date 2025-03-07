import { RequestMessage, ResponseMessage } from "@message/messages/base.ts";
import {
  PayloadType,
  RequestPayload,
  ResponsePayload,
} from "@message/messages/payload/payload.ts";
export type ClientId =
  | {
      type: "background";
      index: 0;
    }
  | {
      type: "website";
      index: number;
      websiteId: string;
    }
  | {
      type: "content";
      index: number;
      websiteId: string;
      blockId: string;
    };

export type MessageClientId =
  | number
  | { type: "background" }
  | { type: "website"; websiteId: string }
  | { type: "content"; websiteId: string; blockId: string };

export type MessageListener<T extends PayloadType> = (
  message: RequestMessage<T>
) => void;

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
