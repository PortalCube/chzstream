import { PayloadSchema } from "../payload.ts";
import type {
  StreamSearchTagOptions,
  StreamSearchTagResponse,
} from "@chzstream/api";

interface StreamSearchTagMessage extends PayloadSchema {
  request: StreamSearchTagOptions;
  response: StreamSearchTagResponse;
}

export const StreamSearchTagMessage: StreamSearchTagMessage = {
  request: {} as StreamSearchTagMessage["request"],
  response: {} as StreamSearchTagMessage["response"],
};
