import {
  BACKGROUND_CLIENT_ID,
  browser,
  ClientBase,
  ClientId,
  MessageClientId,
  MessageListener,
  ListenerMap,
  ListenerItem,
} from "@message/clients/base.ts";
import {
  createRequestMessage,
  createResponseMessage,
  HandshakeResponse,
  isHandshakeRequest,
  isMessage,
  isRequestMessage,
  isResponseMessage,
  Message,
  ResponseMessage,
} from "@message/messages/base.ts";
import {
  PayloadType,
  RequestPayload,
  ResponsePayload,
} from "@message/messages/payload/payload.ts";
import { hasProperty } from "@message/util.ts";

type ClientInfo = ClientId & { port: chrome.runtime.Port | null };

export class BackgroundClient implements ClientBase {
  id: ClientId = {
    type: "background",
    id: BACKGROUND_CLIENT_ID,
  };
  clients: ClientInfo[] = [];
  #listeners: ListenerMap = {};

  constructor() {
    browser.runtime.onMessage.addListener(this.#onHandshake.bind(this));
    browser.runtime.onConnect.addListener(this.#onConnect.bind(this));
  }

  on<T extends PayloadType>(
    type: T,
    listener: MessageListener<T>,
    once: boolean = false
  ): void {
    if (this.#listeners[type] === undefined) {
      this.#listeners[type] = [];
    }

    this.#listeners[type].push({ listener, once });
  }

  remove<T extends PayloadType>(type: T, listener: MessageListener<T>): void {
    if (Array.isArray(this.#listeners[type]) === false) return;

    const index = this.#listeners[type].findIndex(
      (item) => item.listener === listener
    );
    if (index === -1) return;

    this.#listeners[type].splice(index, 1);
  }

  #findClient(id: MessageClientId): chrome.runtime.Port | null {
    const find = this.clients.find((client) => {
      if (typeof id === "string") {
        return client.id === id;
      } else {
        switch (id.type) {
          case "background":
            return false;
          case "website":
            return client.type === "website" && client.id === id.id;
          case "content":
            return (
              client.type === "content" &&
              client.websiteId === id.websiteId &&
              client.blockId === id.blockId
            );
          default:
            return false;
        }
      }
    });

    if (find === undefined) return null;
    return find.port;
  }

  send<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient: MessageClientId = BACKGROUND_CLIENT_ID
  ): void {
    const message: Message = createRequestMessage(
      this.id,
      recipient,
      type,
      data
    );

    const port = this.#findClient(recipient);
    if (port === null) throw new Error("Client not found");

    port.postMessage(message);
  }

  reply<T extends PayloadType>(
    reply: string,
    type: T,
    data: ResponsePayload<T>,
    recipient: MessageClientId = BACKGROUND_CLIENT_ID
  ): void {
    const message: Message = createResponseMessage(
      this.id,
      recipient,
      reply,
      type,
      data
    );

    const port = this.#findClient(recipient);
    if (port === null) throw new Error("Client not found");

    port.postMessage(message);
  }

  request<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient: MessageClientId = BACKGROUND_CLIENT_ID
  ): Promise<ResponseMessage<T>> {
    return new Promise((resolve) => {
      // Request Message 생성
      const message: Message = createRequestMessage(
        this.id,
        recipient,
        type,
        data
      );

      const id = message.id;

      // 수신자 Client 찾기
      const port = this.#findClient(recipient);
      if (port === null) throw new Error("Client not found");

      // Response Message를 받았을 때 실행할 임시 이벤트 리스너
      const listener = (message: unknown, _: chrome.runtime.Port) => {
        // 올바른 Response Message인지 확인
        if (isResponseMessage(type, message) === false) return;
        if (message.reply !== id) return;

        // Response Message 이벤트를 제거하고 Response Message 반환
        port.onMessage.removeListener(listener);
        resolve(message);
      };

      // 임시 이벤트 리스너 등록
      port.onMessage.addListener(listener);

      // RequestMessage 전송
      port.postMessage(message);
    });
  }

  #onHandshake(
    message: unknown,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) {
    if (isHandshakeRequest(message) === false) return;

    let clientId: ClientId;

    if (message.type === "content") {
      clientId = {
        type: "content",
        id: crypto.randomUUID(),
        websiteId: message.websiteId,
        blockId: message.blockId,
      };
    } else if (message.type === "website") {
      clientId = {
        type: "website",
        id: crypto.randomUUID(),
      };
    } else {
      throw new Error("Invalid handshake request");
    }

    this.clients.push({
      ...clientId,
      port: null,
    });

    const response: HandshakeResponse = {
      _CHZSTREAM: "HANDSHAKE_RESPONSE",
      ...clientId,
    };

    sendResponse(response);
  }

  #onMessage(message: unknown, port: chrome.runtime.Port) {
    // Message Check
    if (isMessage(message) === false) return;

    // Relay Check
    if (typeof message.recipient === "string") {
      if (message.recipient !== BACKGROUND_CLIENT_ID) {
        this.#onRelayMessage(message, port);
        return;
      }
    } else if (typeof message.recipient === "object") {
      if (message.recipient.type !== "background") {
        this.#onRelayMessage(message, port);
        return;
      }
    }

    // RequestMessage Check
    if (hasProperty(message, "direction", "request") === false) return;

    const type = message.type as PayloadType;
    if (isRequestMessage(type, message) === false) return;

    // 타입에 대한 Listener가 있는지 확인
    if (Array.isArray(this.#listeners[type]) === false) return;

    const listeners = this.#listeners[type] as ListenerItem<typeof type>[];
    listeners.forEach((item) => {
      // 각각의 Listener 실행
      item.listener(message);

      // once는 실행 후 제거
      if (item.once === true) {
        this.remove(type, item.listener);
      }
    });
  }

  #onRelayMessage(message: Message, port: chrome.runtime.Port) {
    const client = this.#findClient(message.recipient);
    if (client === null) return;

    client.postMessage(message);
  }

  #onDisconnect(port: chrome.runtime.Port) {
    const index = this.clients.findIndex((client) => client.port === port);
    if (index === -1) return;

    this.clients.splice(index, 1);
  }

  #onConnect(port: chrome.runtime.Port) {
    // Handshake가 완료된 port인지 체크
    const find = this.clients.find(
      (client) => client.port === null && client.id === port.name
    );

    if (find === undefined) {
      port.disconnect();
      return;
    }

    // port 등록
    find.port = port;
    port.onDisconnect.addListener(this.#onDisconnect.bind(this));
    port.onMessage.addListener(this.#onMessage.bind(this));
  }
}

// 새로운 Background Client를 생성합니다.
export function createBackgroundClient(): BackgroundClient {
  return new BackgroundClient();
}
