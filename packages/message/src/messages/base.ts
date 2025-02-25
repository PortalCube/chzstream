import { ClientId } from "@message/clients/base.ts";

export interface MessageData {
  type: string;
  request: unknown;
  response?: unknown;
}

export interface Message {
  id: string; // uuid
  reply?: string; // uuid
  sender: ClientId;
  recipient: ClientId;
  data: MessageData;
}
