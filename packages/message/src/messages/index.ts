import type { HeartbeatMessage } from "@message/messages/heartbeat.ts";
import type { PlayerStatusMessage } from "@message/messages/player-status.ts";

type MessageList = HeartbeatMessage | PlayerStatusMessage;

export type Messages<Type extends string> = Extract<
  MessageList,
  { type: Type }
>;

export type RequestMessage<Type extends string> = Messages<Type>["request"];
export type ResponseMessage<Type extends string> = Messages<Type>["response"];
export type HasResponse<Type extends string> =
  Messages<Type>["response"] extends undefined ? false : true;
export type MessageType = MessageList["type"];
