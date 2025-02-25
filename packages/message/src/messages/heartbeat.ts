import { MessageData } from "./base.ts";

export interface HeartbeatMessage extends MessageData {
  type: "heartbeat";
  request: {
    date: string;
  };
  response: {
    date: string;
  };
}
