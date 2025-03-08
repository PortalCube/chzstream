import { PayloadSchema } from "../payload.ts";

interface VideoStatusMessage extends PayloadSchema {
  request: {
    quality?: number;
    volume?: number;
    muted?: boolean;
  };
  response: null;
}

export const VideoStatusMessage: VideoStatusMessage = {
  request: {} as VideoStatusMessage["request"],
  response: null,
};
