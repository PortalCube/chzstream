import { MessageListener } from "@message/clients/base.ts";
import { HeartbeatMessage } from "./heartbeat.ts";
import { PlayerStatusMessage } from "./player-status.ts";

const PAYLOAD_MAP = {
  heartbeat: HeartbeatMessage,
  "player-status": PlayerStatusMessage,
};

export function hasResponse(type: PayloadType) {
  const response = PAYLOAD_MAP[type].response;
  return response !== undefined && response !== null;
}

export type ListenerItem<T extends PayloadType> = {
  listener: MessageListener<T>;
  once: boolean;
};

export type ListenerMap = Partial<{
  [T in PayloadType]: ListenerItem<T>[];
}>;

export type Payload<T extends PayloadType> = (typeof PAYLOAD_MAP)[T];
export type RequestPayload<T extends PayloadType> = Payload<T>["request"];
export type ResponsePayload<T extends PayloadType> = Payload<T>["response"];
export type PayloadType = keyof typeof PAYLOAD_MAP;

export interface PayloadSchema {
  request: unknown;
  response?: unknown;
}
