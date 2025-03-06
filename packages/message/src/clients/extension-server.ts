import { TypedEventTarget } from "typescript-event-target";
import {
  ChzzkChannelInfoRequestMessage,
  ChzzkChannelSearchRequestMessage,
  ChzzkLiveInfoRequestMessage,
  ChzzkLiveListRequestMessage,
  ChzzkLiveSearchRequestMessage,
  createHandshakeResponseMessage,
  HandshakeRequestMessage,
  isChzzkChannelInfoRequestMessage,
  isChzzkChannelSearchRequestMessage,
  isChzzkLiveInfoRequestMessage,
  isChzzkLiveListRequestMessage,
  isChzzkLiveSearchRequestMessage,
  isHandshakeRequestMessage,
  isMessage,
  MessageBase,
} from "@message/messages/index.ts";
import { RecipientType } from "@message/messages/base.ts";
import {
  browser,
  ClientType,
  MESSAGE_VERSION,
  ServerMessageEvent,
} from "@message/clients/base.ts";

export type ExtensionServerEventMap = {
  message: CustomEvent<{
    message: Record<string, unknown>;
    port: chrome.runtime.Port;
  }>;
  disconnect: CustomEvent<void>;
  "chzzk-channel-info": ServerMessageEvent<ChzzkChannelInfoRequestMessage>;
  "chzzk-channel-search": ServerMessageEvent<ChzzkChannelSearchRequestMessage>;
  "chzzk-live-info": ServerMessageEvent<ChzzkLiveInfoRequestMessage>;
  "chzzk-live-search": ServerMessageEvent<ChzzkLiveSearchRequestMessage>;
  "chzzk-live-list": ServerMessageEvent<ChzzkLiveListRequestMessage>;
};

type Connection = {
  id: number;
  type: ClientType;
  port: chrome.runtime.Port;
};

export const ExtensionServerEventTarget =
  TypedEventTarget<ExtensionServerEventMap>;

export class ExtensionServer extends ExtensionServerEventTarget {
  get name() {
    return this.#name;
  }

  get active() {
    return this.#active === true;
  }

  #name: string = "extension-server";
  #active: boolean = false;
  #connections: Connection[] = [];
  allowOrigins: string[] = [];

  #nextId: number = 1;

  constructor(allowOrigins: string[] = []) {
    super();
    this.allowOrigins = allowOrigins;
  }

  listen() {
    if (this.#active === true) {
      return;
    }

    console.log(`[extension-server] listening`);

    this.#active = true;
    browser.runtime.onConnect.addListener(this.#onConnect.bind(this));
    browser.runtime.onMessageExternal.addListener(
      (_message, _sender, sendResponse) => {
        sendResponse();
      }
    );
  }

  disconnect() {
    if (this.#active === false) {
      return;
    }

    this.#active = false;

    for (const connection of this.#connections) {
      connection.port.disconnect();
    }

    this.#connections = [];

    this.dispatchTypedEvent("disconnect", new CustomEvent("disconnect"));
  }

  #onConnect(port: chrome.runtime.Port) {
    if (port.sender === undefined) {
      return;
    }

    if (port.sender.id === undefined) {
      if (port.sender.origin === undefined) return;
      if (this.allowOrigins.includes(port.sender.origin) === false) return;
    }

    console.log(`[extension-server] connection established`, port);

    const id = this.#nextId++;

    port.onMessage.addListener((message: Record<string, unknown>) => {
      this.#onMessage(id, message, port);
    });

    port.onDisconnect.addListener(() => {
      this.#onDisconnect(id);
    });
  }

  #findConnection(id: number) {
    return this.#connections.find((connection) => connection.id === id);
  }

  #relayMessage(message: MessageBase) {
    if (message.recipient === RecipientType.All) {
      for (const connection of this.#connections) {
        connection.port.postMessage(message);
      }

      return false;
    }

    if (message.recipient === RecipientType.AllWebsite) {
      for (const connection of this.#connections) {
        if (connection.type === ClientType.Website) {
          connection.port.postMessage(message);
        }
      }

      return true;
    }

    if (message.recipient === RecipientType.AllIframe) {
      for (const connection of this.#connections) {
        if (connection.type === ClientType.Iframe) {
          connection.port.postMessage(message);
        }
      }

      return true;
    }

    if (message.recipient === RecipientType.Extension) {
      return false;
    }

    if (Array.isArray(message.recipient)) {
      for (const id of message.recipient) {
        const connection = this.#findConnection(id);

        if (connection !== undefined) {
          connection.port.postMessage(message);
        }
      }

      return true;
    }

    if (typeof message.recipient === "number") {
      const connection = this.#findConnection(message.recipient);

      if (connection !== undefined) {
        connection.port.postMessage(message);
      }

      return true;
    }

    return false;
  }

  #onMessage(id: number, message: unknown, port: chrome.runtime.Port) {
    const dispatch = (
      key: keyof ExtensionServerEventMap,
      message: MessageBase
    ) => {
      this.dispatchTypedEvent(
        key,
        new CustomEvent(key, { detail: { message, port } })
      );
    };

    if (isMessage(message) === false) {
      return;
    }

    dispatch("message", message);

    if (this.#relayMessage(message) === true) {
      return;
    }

    if (isHandshakeRequestMessage(message)) {
      this.#onHandshake(id, message, port);
      return;
    }

    if (isChzzkChannelInfoRequestMessage(message)) {
      dispatch("chzzk-channel-info", message);
      return;
    }

    if (isChzzkChannelSearchRequestMessage(message)) {
      dispatch("chzzk-channel-search", message);
      return;
    }

    if (isChzzkLiveInfoRequestMessage(message)) {
      dispatch("chzzk-live-info", message);
      return;
    }

    if (isChzzkLiveSearchRequestMessage(message)) {
      dispatch("chzzk-live-search", message);
      return;
    }

    if (isChzzkLiveListRequestMessage(message)) {
      dispatch("chzzk-live-list", message);
      return;
    }
  }

  #onDisconnect(id: number) {
    const index = this.#connections.findIndex(
      (connection) => connection.id === id
    );

    if (index !== -1) {
      this.#connections.splice(index, 1);
    }

    if (this.#connections.length === 0) {
      this.#nextId = 1;
    }

    console.log(`[extension-server] connection disconnected`);
    console.log(`[extension-server] connections`, this.#connections);
  }

  #onHandshake(
    id: number,
    message: HandshakeRequestMessage,
    port: chrome.runtime.Port
  ) {
    this.#connections.push({
      id,
      port,
      type: message.data.type,
    });

    const responseMessage = createHandshakeResponseMessage(
      {
        id: message.id,
        recipient: id,
        sender: 0,
      },
      {
        version: MESSAGE_VERSION,
        id,
      }
    );

    port.postMessage(responseMessage);
  }
}
