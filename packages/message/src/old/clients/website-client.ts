import { isMessage, ReceiverType } from "@message/old/messages/base";
import {
  createHandshakeRequestMessage,
  createHeartbeatMessage,
  isChzzkChannelInfoResponseMessage,
  isChzzkLiveInfoResponseMessage,
  isHandshakeIframeMessage,
  isHandshakeResponseMessage,
  isIframePointerMoveMessage,
  isPlayerControlMessage,
  isPlayerEventMessage,
  Message,
} from "@message/old/messages";
import {
  browser,
  ClientMessageEvent,
  ClientType,
  WEB_EXTENSION_ID,
  WebsiteClientEventMap,
  WebsiteClientEventTarget,
  WebsiteClientInterface,
} from "@message/old/clients/base";

export class WebsiteClient
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
    return this.#port !== null;
  }

  #name: string = "website-client";
  #id: number | null = null;
  #port: chrome.runtime.Port | null = null;
  #heartbeatInterval: number | null = null;

  constructor() {
    super();
  }

  async connect() {
    if (this.#port !== null) {
      return;
    }

    for (const id of WEB_EXTENSION_ID) {
      try {
        await browser.runtime.sendMessage(id, "");

        this.#port = browser.runtime.connect(id, {
          name: this.#name,
        });

        break;
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);

          if (e.message.includes("Invalid extension id")) {
            continue;
          }

          if (e.message.includes("Could not establish connection")) {
            continue;
          }
        }

        throw e;
      }
    }

    if (this.#port === null) {
      console.error("[website-client] 확장프로그램에 연결하지 못했습니다");
      return;
    }

    this.#port.onMessage.addListener(this.#onMessage.bind(this));
    this.#port.onDisconnect.addListener(this.#onDisconnect.bind(this));

    const handshakeMessage = createHandshakeRequestMessage(
      {
        sender: null,
        receiver: ReceiverType.Extension,
      },
      ClientType.Website
    );

    const response = await this.request(
      handshakeMessage,
      isHandshakeResponseMessage
    );
    this.#id = response.data.id;

    this.#heartbeatInterval = window.setInterval(
      this.#heartbeat.bind(this),
      25000
    );

    return;
  }

  disconnect() {
    if (this.#port === null) {
      return;
    }

    if (this.#heartbeatInterval) {
      window.clearInterval(this.#heartbeatInterval as number);
    }

    this.#port.disconnect();
  }

  async #heartbeat() {
    const heartbeatMessage = createHeartbeatMessage({
      sender: this.#id,
      receiver: ReceiverType.Extension,
    });

    this.send(heartbeatMessage);
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
      this.send(message);

      setTimeout(() => {
        this.removeEventListener("message", onMessage);
        reject("요청을 처리하는데 너무 오래걸립니다.");
      }, 10000);
    });
  }

  #onMessage(message: unknown) {
    const dispatch = (key: keyof WebsiteClientEventMap, message: Message) => {
      this.dispatchTypedEvent(key, new CustomEvent(key, { detail: message }));
    };

    if (isMessage(message) === false) {
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

    if (isPlayerControlMessage(message)) {
      dispatch("player-control", message);
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

  #onDisconnect() {
    this.#port = null;
    this.dispatchTypedEvent("disconnect", new CustomEvent("disconnect"));
  }

  static isAvailable(): boolean {
    return browser?.runtime?.connect !== undefined;
  }
}
