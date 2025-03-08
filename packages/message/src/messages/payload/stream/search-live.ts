import { PayloadSchema } from "../payload.ts";
import type {
  StreamSearchLiveOptions,
  StreamSearchLiveResponse,
} from "@chzstream/api";

interface StreamSearchLiveMessage extends PayloadSchema {
  request: StreamSearchLiveOptions;
  response: StreamSearchLiveResponse;
}

export const StreamSearchLiveMessage: StreamSearchLiveMessage = {
  request: {} as StreamSearchLiveMessage["request"],
  response: {} as StreamSearchLiveMessage["response"],
};
