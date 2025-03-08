import { PayloadSchema } from "../payload.ts";
import type {
  StreamGetLiveListOptions,
  StreamGetLiveListResponse,
} from "@chzstream/api";

interface StreamGetLiveListMessage extends PayloadSchema {
  request: StreamGetLiveListOptions;
  response: StreamGetLiveListResponse;
}

export const StreamGetLiveListMessage: StreamGetLiveListMessage = {
  request: {} as StreamGetLiveListMessage["request"],
  response: {} as StreamGetLiveListMessage["response"],
};
