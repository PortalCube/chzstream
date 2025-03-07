import {
  ClientBase,
  ClientId,
  MessageClientId,
  MessageListener,
} from "@message/clients/base.ts";
import {
  createRequestMessage,
  createResponseMessage,
  isResponseMessage,
  Message,
  ResponseMessage,
} from "@message/messages/base.ts";
import {
  PayloadType,
  RequestPayload,
  ResponsePayload,
  ListenerMap,
} from "@message/messages/payload/payload.ts";

type ClientInfo = ClientId & { port: chrome.runtime.Port };

class BackgroundClient implements ClientBase {
  id: ClientId = { type: "background", index: 0 };
  clients: ClientInfo[] = [];
  listeners: ListenerMap = {};

  constructor() {}

  on<T extends PayloadType>(
    type: T,
    listener: MessageListener<T>,
    once: boolean = false
  ): void {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = [];
    }

    this.listeners[type].push({ listener, once });
  }

  remove<T extends PayloadType>(type: T, listener: MessageListener<T>): void {
    if (Array.isArray(this.listeners[type]) === false) return;

    const index = this.listeners[type].findIndex(
      (item) => item.listener === listener
    );
    if (index === -1) return;

    this.listeners[type].splice(index, 1);
  }

  #findClient(id: MessageClientId): ClientInfo | undefined {
    if (typeof id === "number") {
      return this.clients.find((client) => client.index === id);
    }

    return this.clients.find((client) => {
      switch (id.type) {
        case "background":
          // ???
          return undefined;
        case "website":
          return client.type === id.type && client.websiteId === id.websiteId;
        case "content":
          return (
            client.type === id.type &&
            client.websiteId === id.websiteId &&
            client.blockId === id.blockId
          );
        default:
          return undefined;
      }
    });
  }

  send<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient: MessageClientId = 0
  ): void {
    const message: Message = createRequestMessage(
      this.id,
      recipient,
      type,
      data
    );

    const client = this.#findClient(recipient);
    if (client === undefined) throw new Error("Client not found");

    client.port.postMessage(message);
  }

  reply<T extends PayloadType>(
    reply: string,
    type: T,
    data: ResponsePayload<T>,
    recipient: MessageClientId = 0
  ): void {
    const message: Message = createResponseMessage(
      this.id,
      recipient,
      reply,
      type,
      data
    );

    const client = this.#findClient(recipient);
    if (client === undefined) throw new Error("Client not found");

    client.port.postMessage(message);
  }

  request<T extends PayloadType>(
    type: T,
    data: RequestPayload<T>,
    recipient: MessageClientId = 0
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
      const client = this.#findClient(recipient);
      if (client === undefined) throw new Error("Client not found");

      client.port.postMessage(message);

      // Response Message를 받았을 때 실행할 임시 이벤트 리스너
      const listener = (message: unknown, port: chrome.runtime.Port) => {
        // 올바른 Response Message인지 확인
        if (isResponseMessage(type, message) === false) return;
        if (message.reply !== id) return;

        // Response Message 이벤트를 제거하고 Response Message 반환
        client.port.onMessage.removeListener(listener);
        resolve(message);
      };

      // 임시 이벤트 리스너 등록
      client.port.onMessage.addListener(listener);

      // RequestMessage 전송
      client.port.postMessage(message);
    });
  }

  #onMessage(message: Message, port: chrome.runtime.Port) {}

  #onDisconnect(port: chrome.runtime.Port) {}

  #onHandshake() {}
}

export function createBackgroundClient(): BackgroundClient {
  return new BackgroundClient();
}
