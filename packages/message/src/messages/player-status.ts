import { MessageData } from "./base.ts";

export interface PlayerStatusMessage extends MessageData {
  type: "player-status";
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
}
