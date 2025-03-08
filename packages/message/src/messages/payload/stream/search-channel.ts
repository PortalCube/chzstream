import { PayloadSchema } from "../payload.ts";
import type {
  StreamSearchChannelOptions,
  StreamSearchChannelResponse,
} from "@chzstream/api";

interface StreamSearchChannelMessage extends PayloadSchema {
  request: StreamSearchChannelOptions;
  response: StreamSearchChannelResponse;
}

export const StreamSearchChannelMessage: StreamSearchChannelMessage = {
  request: {} as StreamSearchChannelMessage["request"],
  response: {} as StreamSearchChannelMessage["response"],
};
