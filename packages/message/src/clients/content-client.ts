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
  HandshakeRequest,
  isHandshakeResponse,
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

class ContentClient implements ClientBase {
  id: ClientId;
  port: chrome.runtime.Port;
  #listeners: ListenerMap = {};

  constructor(id: ClientId, port: chrome.runtime.Port) {
    this.id = id;
    this.port = port;

    this.port.onMessage.addListener(this.#onMessage.bind(this));
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

    this.port.postMessage(message);
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

    this.port.postMessage(message);
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

      // Response Message를 받았을 때 실행할 임시 이벤트 리스너
      const listener = (message: unknown, port: chrome.runtime.Port) => {
        // 올바른 Response Message인지 확인
        if (isResponseMessage(type, message) === false) return;
        if (message.reply !== id) return;

        // Response Message 이벤트를 제거하고 Response Message 반환
        this.port.onMessage.removeListener(listener);
        resolve(message);
      };

      // 임시 이벤트 리스너 등록
      this.port.onMessage.addListener(listener);

      // RequestMessage 전송
      this.port.postMessage(message);
    });
  }

  #onMessage(message: unknown, port: chrome.runtime.Port) {
    // Message Check
    if (isMessage(message) === false) return;

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
}

// 새로운 Content Client를 등록하고 생성합니다.
export async function createContentClient(
  websiteId: string,
  blockId: string
): Promise<ContentClient> {
  return new Promise((resolve) => {
    const request: HandshakeRequest = {
      _CHZSTREAM: "HANDSHAKE_REQUEST",
      type: "content",
      websiteId,
      blockId,
    };

    // Handshake Request 전송
    browser.runtime.sendMessage(request).then((response: unknown) => {
      // 올바른 Handshake Response인지 확인
      if (isHandshakeResponse(response) === false) return;
      if (response.type !== "content") return;

      // clientId를 가져오고 port 생성
      const port = browser.runtime.connect({ name: "content-client" });
      const clientId: ClientId = {
        id: response.id,
        type: "content",
        websiteId: response.websiteId,
        blockId: response.blockId,
      };

      // Content Client 생성후 반환
      resolve(new ContentClient(clientId, port));
    });
  });
}
