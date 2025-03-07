import { ClientId, MessageClientId } from "@message/clients/base.ts";
import { hasProperty, isObject } from "@message/util.ts";
import {
  PayloadType,
  RequestPayload,
  ResponsePayload,
} from "./payload/payload.ts";

/** RawMessage **/
export interface RawMessage<T extends string> {
  _CHZSTREAM: T;
}

export function isRawMessage<
  Type extends string,
  MessageType extends RawMessage<Type>,
>(value: unknown, type: Type): value is MessageType {
  return isObject(value) && value._CHZSTREAM === type;
}

/** Message **/
export interface Message extends RawMessage<"MESSAGE"> {
  id: string; // uuid
  sender: ClientId;
  recipient: MessageClientId;
}

export function isMessage(value: unknown): value is Message {
  return isRawMessage(value, "MESSAGE");
}

/** RequestMessage **/
export interface RequestMessage<T extends PayloadType> extends Message {
  direction: "request";
  type: T;
  data: RequestPayload<T>;
}

export function isRequestMessage<T extends PayloadType>(
  type: T,
  value: unknown
): value is RequestMessage<T> {
  if (isMessage(value) === false) return false;
  if (hasProperty(value, "direction", "request") === false) return false;
  if (hasProperty(value, "type", type) === false) return false;

  return true;
}

export function createRequestMessage<T extends PayloadType>(
  sender: ClientId,
  recipient: MessageClientId,
  type: T,
  data: RequestPayload<T>
): RequestMessage<T> {
  return {
    _CHZSTREAM: "MESSAGE",
    id: crypto.randomUUID(),
    sender,
    recipient,
    direction: "request",
    type,
    data,
  };
}

/** ResponseMessage **/
export interface ResponseMessage<T extends PayloadType> extends Message {
  direction: "response";
  reply: string; // uuid
  type: T;
  data: ResponsePayload<T>;
}

export function isResponseMessage<T extends PayloadType>(
  type: T,
  value: unknown
): value is ResponseMessage<T> {
  if (isMessage(value) === false) return false;
  if (hasProperty(value, "direction", "response") === false) return false;
  if (hasProperty(value, "type", type) === false) return false;

  return true;
}

export function createResponseMessage<T extends PayloadType>(
  sender: ClientId,
  recipient: MessageClientId,
  reply: string,
  type: T,
  data: ResponsePayload<T>
): ResponseMessage<T> {
  return {
    _CHZSTREAM: "MESSAGE",
    id: crypto.randomUUID(),
    sender,
    recipient,
    direction: "response",
    reply,
    type,
    data,
  };
}

/** HandshakeRequest **/
export type HandshakeRequest = RawMessage<"HANDSHAKE_REQUEST"> &
  (
    | {
        type: "website";
      }
    | {
        type: "content";
        websiteId: string;
        blockId: string;
      }
  );

export function isHandshakeRequest(value: unknown): value is HandshakeRequest {
  return isRawMessage(value, "HANDSHAKE_REQUEST");
}

/** HandshakeResponse **/
export type HandshakeResponse = RawMessage<"HANDSHAKE_RESPONSE"> &
  Exclude<ClientId, { type: "background" }>;

export function isHandshakeResponse(
  value: unknown
): value is HandshakeResponse {
  return isRawMessage(value, "HANDSHAKE_RESPONSE");
}
