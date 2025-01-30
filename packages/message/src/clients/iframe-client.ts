import { createNanoEvents } from "nanoevents";
import { isMessage, ReceiverType } from "../messages/base.ts";
import {
  createHandshakeRequestMessage,
  isHandshakeResponseMessage,
  Message,
} from "../messages/index.ts";
import { browser, ClientType } from "./base.ts";

export type IframeClientEvent = {
  message: (message: Message) => void;
  disconnect: () => void;
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
        receiver: ReceiverType.Extension,
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

  send(message: Message) {
    if (this.#port === null) {
      return;
    }

    this.#port.postMessage(message);
  }

  request<T extends Message, K extends Message>(
    message: T,
    isMessage: (message: Message) => message is K
  ): Promise<K> {
    return new Promise((resolve, reject) => {
      if (this.#port === null) {
        reject(new Error("Client is not connected"));
        return;
      }

      const onMessage = (value: Message) => {
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
  }

  #onDisconnect() {
    this.#port = null;
    this.#emitter.emit("disconnect");
  }
}
