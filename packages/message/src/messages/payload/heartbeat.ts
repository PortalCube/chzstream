import { PayloadSchema } from "./payload.ts";

interface HeartbeatMessage extends PayloadSchema {
  request: {
    date: string;
  };
  response: {
    date: string;
  };
}

export const HeartbeatMessage: HeartbeatMessage = {
  request: {} as HeartbeatMessage["request"],
  response: {} as HeartbeatMessage["response"],
};
