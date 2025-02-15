import {
  isMessage,
  MessageType,
  ReceiverType,
} from "@message/messages/base.ts";
import {
  createHandshakeRequestMessage,
  createHeartbeatMessage,
  isChzzkChannelInfoResponseMessage,
  isChzzkLiveInfoResponseMessage,
  isHandshakeIframeMessage,
  isHandshakeResponseMessage,
  isIframePointerMoveMessage,
  isPlayerEventMessage,
  Message,
} from "@message/messages/index.ts";
import {
  ClientMessageEvent,
  ClientType,
  WebsiteClientEventMap,
  WebsiteClientEventTarget,
  WebsiteClientInterface,
} from "@message/clients/base.ts";

// https://bugzilla.mozilla.org/show_bug.cgi?id=1319168

export class WindowClient
  extends WebsiteClientEventTarget
  implements WebsiteClientInterface
{
  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }

  get active() {
    return this.#active === true;
  }

  #name: string = "window-client";
  #id: number | null = null;
  #active: boolean = false;
  #origin: string = "";
  #heartbeatInterval: number | null = null;

  constructor() {
    super();
  }

  async connect() {
    if (this.#active === true) {
      return;
    }

    const url = new URL(window.location.href);
    this.#origin = url.origin;

    window.addEventListener("message", this.#onMessage.bind(this));

    const handshakeMessage = createHandshakeRequestMessage(
      {
        sender: null,
        receiver: ReceiverType.Extension,
      },
      ClientType.Website
    );

    try {
      const response = await this.request(
        handshakeMessage,
        isHandshakeResponseMessage,
        1000,
        true
      );

      this.#id = response.data.id;
    } catch (_e) {
      return;
    }

    this.#heartbeatInterval = window.setInterval(
      this.#heartbeat.bind(this),
      25000
    );

    this.#active = true;

    return;
  }

  disconnect() {
    if (this.#active === false) {
      return;
    }

    this.#active = false;

    if (this.#heartbeatInterval) {
      window.clearInterval(this.#heartbeatInterval as number);
    }

    window.removeEventListener("message", this.#onMessage.bind(this));

    this.dispatchTypedEvent("disconnect", new CustomEvent("disconnect"));
  }

  async #heartbeat() {
    const heartbeatMessage = createHeartbeatMessage({
      sender: this.#id,
      receiver: ReceiverType.Extension,
    });

    this.send(heartbeatMessage);
  }

  send(message: Message, force: boolean = false) {
    if (force === false && this.#active === false) {
      return;
    }

    message.type = MessageType.Request;

    window.postMessage(message, this.#origin);
  }

  request<T extends Message, K extends Message>(
    message: T,
    isMessage: (message: Message) => message is K,
    timeout: number = 10000,
    force: boolean = false
  ): Promise<K> {
    return new Promise((resolve, reject) => {
      if (force === false && this.#active === false) {
        reject(new Error("Client is not connected"));
        return;
      }

      const onMessage = (event: ClientMessageEvent<Message>) => {
        if (isMessage(event.detail) === false) {
          return;
        }

        if (event.detail.id !== message.id) {
          return;
        }

        this.removeEventListener("message", onMessage);
        resolve(event.detail);
      };

      this.addEventListener("message", onMessage);
      this.send(message, force);

      setTimeout(() => {
        this.removeEventListener("message", onMessage);
        reject("요청을 처리하는데 너무 오래걸립니다.");
      }, timeout);
    });
  }

  #onMessage(event: MessageEvent) {
    const dispatch = (key: keyof WebsiteClientEventMap, message: Message) => {
      this.dispatchTypedEvent(key, new CustomEvent(key, { detail: message }));
    };

    if (event.origin !== this.#origin) {
      return;
    }

    const message = event.data;

    if (isMessage(message) === false) {
      return;
    }

    if (message.type === MessageType.Request) {
      return;
    }

    dispatch("message", message);

    if (isChzzkChannelInfoResponseMessage(message)) {
      dispatch("chzzk-channel-info", message);
      return;
    }

    if (isChzzkLiveInfoResponseMessage(message)) {
      dispatch("chzzk-live-info", message);
      return;
    }

    if (isPlayerEventMessage(message)) {
      dispatch("player-event", message);
      return;
    }

    if (isIframePointerMoveMessage(message)) {
      dispatch("iframe-pointer-move", message);
      return;
    }

    if (isHandshakeIframeMessage(message)) {
      dispatch("iframe-handshake", message);
    }
  }
}
