import {
  isHandshakeRequestMessage,
  isHandshakeResponseMessage,
  isMessage,
  MessageType,
} from "@message/messages/index.ts";
import { browser } from "@message/clients/base.ts";

export class WebsiteRelay {
  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get active() {
    return this.#active === true;
  }

  #name: string = "window-relay";
  #id: number | null = null;
  #port: chrome.runtime.Port | null = null;
  #active: boolean = false;
  #origin: string = "";

  constructor() {}

  listen() {
    if (this.#active === true) {
      return;
    }

    this.#active = true;

    const url = new URL(window.location.href);
    this.#origin = url.origin;

    window.addEventListener("message", this.#onWindowMessage.bind(this));
  }

  #connect() {
    if (this.#port !== null) {
      return;
    }

    this.#port = browser.runtime.connect({
      name: this.#name,
    });
    this.#port.onMessage.addListener(this.#onMessage.bind(this));
    this.#port.onDisconnect.addListener(this.#onDisconnect.bind(this));
  }

  disconnect() {
    if (this.#active === false) {
      return;
    }

    this.#active = false;

    window.removeEventListener("message", this.#onWindowMessage.bind(this));
  }

  #onWindowMessage(event: MessageEvent) {
    if (event.origin !== this.#origin) {
      return;
    }

    const message = event.data;

    if (isMessage(message) === false) {
      return;
    }

    if (message.type === MessageType.Response) {
      return;
    }

    if (isHandshakeRequestMessage(message) === true) {
      this.#connect();
    }

    if (this.#port === null) {
      return;
    }

    this.#port.postMessage(message);
  }

  #onMessage(message: unknown, _port: chrome.runtime.Port) {
    if (isMessage(message) === false) {
      return;
    }

    message.type = MessageType.Response;

    if (isHandshakeResponseMessage(message) === true) {
      this.#id = message.data.id;
    }

    window.postMessage(message, this.#origin);
  }

  #onDisconnect() {
    this.#active = false;
    this.#port = null;

    console.log(`[window-relay] disconnected`);
  }
}
