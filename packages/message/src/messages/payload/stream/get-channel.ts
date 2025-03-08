import { PayloadSchema } from "../payload.ts";
import type {
  StreamGetChannelOptions,
  StreamGetChannelResponse,
} from "@chzstream/api";

interface StreamGetChannelMessage extends PayloadSchema {
  request: StreamGetChannelOptions;
  response: StreamGetChannelResponse;
}

export const StreamGetChannelMessage: StreamGetChannelMessage = {
  request: {} as StreamGetChannelMessage["request"],
  response: {} as StreamGetChannelMessage["response"],
};
