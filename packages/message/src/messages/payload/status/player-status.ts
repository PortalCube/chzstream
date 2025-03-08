import { PayloadSchema } from "../payload.ts";

interface PlayerStatusMessage extends PayloadSchema {
  request:
    | {
        type: "loading";
      }
    | {
        type: "ready";
      }
    | {
        type: "end";
      }
    | {
        type: "adult";
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
