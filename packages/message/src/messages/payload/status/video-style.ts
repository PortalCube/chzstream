import { PayloadSchema } from "../payload.ts";

interface VideoStyleMessage extends PayloadSchema {
  request: {
    objectFit: "contain" | "cover" | "fill";
    objectPosition: {
      horizontal: "left" | "center" | "right";
      vertical: "top" | "center" | "bottom";
    };
  };
  response: null;
}

export const VideoStyleMessage: VideoStyleMessage = {
  request: {} as VideoStyleMessage["request"],
  response: null,
};
