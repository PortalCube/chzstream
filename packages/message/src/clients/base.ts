import {
  HasResponse,
  MessageType,
  RequestMessage,
  ResponseMessage,
} from "@message/messages/index.ts";

export type ClientId =
  | {
      type: "background";
      index: 0;
    }
  | {
      type: "website";
      index: number;
      websiteId: string;
    }
  | {
      type: "content";
      index: number;
      websiteId: string;
      blockId: string;
    };

export type MessageClientId =
  | number
  | { type: "background" }
  | { type: "website"; websiteId: string }
  | { type: "content"; websiteId: string; blockId: string };

export type MessageListener<T extends MessageType> = (
  message: RequestMessage<T>,
  sender: MessageClientId,
  reply: HasResponse<T> extends true
    ? (data: ResponseMessage<T>) => void
    : undefined
) => unknown;

export interface ClientBase {
  readonly id: ClientId;

  on<T extends MessageType>(type: T, listener: MessageListener<T>): void;

  remove<T extends MessageType>(type: T, listener: MessageListener<T>): void;

  send<T extends MessageType>(
    type: T,
    data: RequestMessage<T>,
    recipient?: MessageClientId
  ): void;

  request<T extends MessageType>(
    type: T,
    data: RequestMessage<T>,
    recipient?: MessageClientId
  ): HasResponse<T> extends true ? Promise<ResponseMessage<T>> : never;
}
