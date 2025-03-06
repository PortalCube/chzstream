import { TypedEventTarget } from "typescript-event-target";
import {
  ChzzkChannelInfoResponseMessage,
  ChzzkLiveInfoResponseMessage,
  HandshakeIframeMessage,
  IframePointerMoveMessage,
  MessageBase,
  PlayerControlMessage,
  PlayerEventMessage,
} from "@message/messages/index.ts";

function getBrowser(): typeof chrome {
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
  return globalThis.chrome;
}

export const browser: typeof chrome = getBrowser();

export const MESSAGE_VERSION = "0.0.0";

export enum ClientType {
  Website = "website",
  Iframe = "iframe",
}

export type ClientMessageEvent<T extends MessageBase> = CustomEvent<T>;

export type ServerMessageEvent<T extends MessageBase> = CustomEvent<{
  message: T;
  port: chrome.runtime.Port;
}>;

export type WebsiteClientEventMap = {
  message: ClientMessageEvent<MessageBase>;
  disconnect: CustomEvent<void>;
  "player-event": ClientMessageEvent<PlayerEventMessage>;
  "player-control": ClientMessageEvent<PlayerControlMessage>;
  "chzzk-channel-info": ClientMessageEvent<ChzzkChannelInfoResponseMessage>;
  "chzzk-channel-search": ClientMessageEvent<ChzzkChannelInfoResponseMessage>;
  "chzzk-live-info": ClientMessageEvent<ChzzkLiveInfoResponseMessage>;
  "chzzk-live-search": ClientMessageEvent<ChzzkLiveInfoResponseMessage>;
  "chzzk-live-list": ClientMessageEvent<ChzzkChannelInfoResponseMessage>;
  "iframe-pointer-move": ClientMessageEvent<IframePointerMoveMessage>;
  "iframe-handshake": ClientMessageEvent<HandshakeIframeMessage>;
};

export const WebsiteClientEventTarget = TypedEventTarget<WebsiteClientEventMap>;

export interface WebsiteClientInterface {
  get name(): string;
  get id(): number | null;

  connect(): Promise<void>;
  disconnect(): void;
  send(message: MessageBase): void;
  request<T extends MessageBase>(
    message: MessageBase,
    isResponse: (message: MessageBase) => message is T
  ): Promise<T>;
}
