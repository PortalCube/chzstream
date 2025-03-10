import {
  BACKGROUND_CLIENT_ID,
  ClientBase,
  ClientId,
  ListenerItem,
  ListenerMap,
  MessageClientId,
  MessageListener,
} from "@message/clients/base.ts";
import {
  createRequestMessage,
  createResponseMessage,
  HandshakeResponse,
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

export class WebsiteClient implements ClientBase {
  id: ClientId;
  #listeners: ListenerMap = {};

  constructor(id: ClientId) {
    this.id = id;
    document.addEventListener("@chzstream/receive", this.#onMessage);
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

    document.dispatchEvent(
      new CustomEvent("@chzstream/send", {
        detail: message,
      })
    );
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

    document.dispatchEvent(
      new CustomEvent("@chzstream/send", {
        detail: message,
      })
    );
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
      const listener = (event: CustomEventInit<Message>) => {
        const message = event.detail;

        // 올바른 Response Message인지 확인
        if (isResponseMessage(type, message) === false) return;
        if (message.reply !== id) return;

        // Response Message 이벤트를 제거하고 Response Message 반환
        document.removeEventListener("@chzstream/receive", listener);
        resolve(message);
      };

      // 임시 이벤트 리스너 등록
      document.addEventListener("@chzstream/receive", listener);

      // RequestMessage 전송
      document.dispatchEvent(
        new CustomEvent("@chzstream/send", {
          detail: message,
        })
      );
    });
  }

  #onMessage(event: CustomEventInit<Message>) {
    // Message Check
    const message = event.detail;
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

// 새로운 Website Client를 등록하고 생성합니다.
export function createWebsiteClient(): Promise<WebsiteClient> {
  return new Promise((resolve) => {
    // Handshake Response를 받았을 때 실행할 임시 이벤트 리스너
    const listener = (event: CustomEventInit<HandshakeResponse>) => {
      const message = event.detail;

      // 올바른 Handshake Response인지 확인
      if (isHandshakeResponse(message) === false) return;
      if (message.type !== "website") return;

      const clientId: ClientId = {
        id: message.id,
        type: "website",
      };

      // Handshake Response 이벤트를 제거하고 Website Client를 생성 후 반환
      document.removeEventListener("@chzstream/handshake-response", listener);
      resolve(new WebsiteClient(clientId));
    };

    // 임시 이벤트 리스너 등록
    document.addEventListener("@chzstream/handshake-response", listener);

    // Handshake Request 전송
    document.dispatchEvent(
      new CustomEvent("@chzstream/handshake-request", {
        detail: {
          _CHZSTREAM: "HANDSHAKE_REQUEST",
          type: "website",
        },
      })
    );
  });
}

export function checkWebsiteClient(): boolean {
  // @ts-expect-error Custom Property
  return window.__CHZSTREAM_EXTENSION__ === true;
}
