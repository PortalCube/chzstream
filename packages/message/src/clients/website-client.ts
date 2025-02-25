import {
  HasResponse,
  MessageType,
  RequestMessage,
  ResponseMessage,
} from "@message/messages/index.ts";
import {
  ClientBase,
  ClientId,
  MessageClientId,
  MessageListener,
} from "@message/clients/base.ts";

export class WebsiteClient implements ClientBase {
  id: ClientId;

  constructor(id: ClientId) {
    this.id = id;
  }

  on<T extends MessageType>(type: T, listener: MessageListener<T>): void {
    throw new Error("not implemented");
  }

  remove<T extends MessageType>(type: T, listener: MessageListener<T>): void {
    throw new Error("not implemented");
  }

  send<T extends MessageType>(
    type: T,
    data: RequestMessage<T>,
    recipient: MessageClientId = 0
  ): void {
    throw new Error("not implemented");
  }

  request<T extends MessageType>(
    type: T,
    data: RequestMessage<T>,
    recipient: MessageClientId = 0
  ): HasResponse<T> extends true ? Promise<ResponseMessage<T>> : never {
    throw new Error("not implemented");
  }
}
