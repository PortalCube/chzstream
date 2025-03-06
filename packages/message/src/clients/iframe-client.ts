import { createNanoEvents } from "nanoevents";
import { isMessage, RecipientType } from "@message/messages/base.ts";
import {
  createHandshakeRequestMessage,
  isHandshakeResponseMessage,
  isPlayerControlMessage,
  MessageBase,
  PlayerControlMessage,
} from "@message/messages/index.ts";
import { browser, ClientType } from "@message/clients/base.ts";

export type IframeClientEvent = {
  message: (message: MessageBase) => void;
  disconnect: () => void;
  "player-control": (message: PlayerControlMessage) => void;
};

type Listener = {
  event: keyof IframeClientEvent;
  function: IframeClientEvent[keyof IframeClientEvent];
  unbind: () => void;
};

// https://bugzilla.mozilla.org/show_bug.cgi?id=1896267
// https://bugzilla.mozilla.org/show_bug.cgi?id=1820521

export class IframeClient {
  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get active() {
    return this.#port !== null;
  }

  #name: string = "iframe-client";
  #id: number | null = null;
  #port: chrome.runtime.Port | null = null;
  #emitter = createNanoEvents<IframeClientEvent>();
  #emitterEvents: Listener[] = [];

  constructor() {}

  addEventListener<K extends keyof IframeClientEvent>(
    key: K,
    listener: IframeClientEvent[K]
  ) {
    const unbind = this.#emitter.on(key, listener);
    this.#emitterEvents.push({ event: key, function: listener, unbind });
  }

  removeEventListener<K extends keyof IframeClientEvent>(
    key: K,
    listener: IframeClientEvent[K]
  ) {
    const index = this.#emitterEvents.findIndex(
      (event) => event.event === key && event.function === listener
    );

    if (index === -1) {
      return;
    }

    this.#emitterEvents[index].unbind();
    this.#emitterEvents.splice(index, 1);
  }

  async connect() {
    if (this.#port !== null) {
      return;
    }

    this.#port = browser.runtime.connect({ name: this.#name });
    this.#port.onMessage.addListener(this.#onMessage.bind(this));
    this.#port.onDisconnect.addListener(this.#onDisconnect.bind(this));

    const handshakeMessage = createHandshakeRequestMessage(
      {
        sender: null,
        recipient: RecipientType.Extension,
      },
      ClientType.Iframe
    );

    const response = await this.request(
      handshakeMessage,
      isHandshakeResponseMessage
    );
    this.#id = response.data.id;
  }

  disconnect() {
    if (this.#port === null) {
      return;
    }

    this.#port.disconnect();
  }

  send(message: MessageBase) {
    if (this.#port === null) {
      return;
    }

    this.#port.postMessage(message);
  }

  request<T extends MessageBase, K extends MessageBase>(
    message: T,
    isMessage: (message: MessageBase) => message is K
  ): Promise<K> {
    return new Promise((resolve, reject) => {
      if (this.#port === null) {
        reject(new Error("Client is not connected"));
        return;
      }

      const onMessage = (value: MessageBase) => {
        if (isMessage(value) === false) {
          return;
        }

        if (value.id !== message.id) {
          return;
        }

        this.removeEventListener("message", onMessage);
        resolve(value);
      };

      this.addEventListener("message", onMessage);
      this.send(message);

      setTimeout(() => {
        this.removeEventListener("message", onMessage);
        reject("요청을 처리하는데 너무 오래걸립니다.");
      }, 10000);
    });
  }

  #onMessage(message: unknown) {
    if (isMessage(message) === false) {
      return;
    }

    this.#emitter.emit("message", message);

    if (isPlayerControlMessage(message)) {
      this.#emitter.emit("player-control", message);
    }
  }

  #onDisconnect() {
    this.#port = null;
    this.#emitter.emit("disconnect");
  }
}
