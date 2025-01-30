import { TypedEventTarget } from "typescript-event-target";
import {
  isHandshakeRequestMessage,
  isHandshakeResponseMessage,
  isMessage,
  MessageType,
} from "../messages/index.ts";
import { browser } from "./base.ts";

type RelayEventMap = {
  disconnect: CustomEvent<void>;
};

// WindowRelay는 WindowClient가 전송한 window.postMessage를 받아서
// browser.runtime.connect를 통해 ExtensionServer로 전송하는 릴레이입니다.

// Note: iframe-client.ts에서 언급한대로 Firefox의 content script에서는
// EventTarget이 작동하지 않는 버그가 있습니다.
// 그래서 사실 WindowRelay의 EventTarget도 작동하지 않지만 쓰이는 곳이 전혀 없으므로 그냥 냅뒀습니다

export class WindowRelay extends TypedEventTarget<RelayEventMap> {
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

  constructor() {
    super();
  }

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

    this.dispatchTypedEvent("disconnect", new CustomEvent("disconnect"));
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

  #onMessage(message: unknown, port: chrome.runtime.Port) {
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

    console.log(`[window-relay] disconnected!!`);

    this.dispatchTypedEvent("disconnect", new CustomEvent("disconnect"));
  }
}
