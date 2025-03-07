import { PayloadSchema } from "./payload.ts";

interface PlayerStatusMessage extends PayloadSchema {
  request:
    | {
        type: "loading";
        date: number;
      }
    | {
        type: "ready";
        date: number;
      }
    | {
        type: "end";
        date: number;
      }
    | {
        type: "adult";
        liveId: number;
      }
    | {
        type: "error";
        message: string;
      };
  response: null;
}

export const PlayerStatusMessage: PlayerStatusMessage = {
  request: {} as PlayerStatusMessage["request"],
  response: null,
};
