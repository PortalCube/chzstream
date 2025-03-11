import { HeartbeatMessage } from "./heartbeat.ts";
import { IframePointerMoveMessage } from "./iframe-event/iframe-pointer-move.ts";
import { IframeKeyDownMessage } from "./iframe-event/iframe-key-down.ts";
import { PlayerStatusMessage } from "./status/player-status.ts";
import { StreamGetChannelMessage } from "./stream/get-channel.ts";
import { StreamGetLiveListMessage } from "./stream/get-live-list.ts";
import { StreamSearchChannelMessage } from "./stream/search-channel.ts";
import { StreamSearchLiveMessage } from "./stream/search-live.ts";
import { VideoStatusMessage } from "./status/video-status.ts";

export const PAYLOAD_MAP = {
  /* Heartbeat */
  heartbeat: HeartbeatMessage,

  /* Status */
  "player-status": PlayerStatusMessage,
  "video-status": VideoStatusMessage,

  /* Iframe Event */
  "iframe-pointer-move": IframePointerMoveMessage,
  "iframe-key-down": IframeKeyDownMessage,

  /* Stream */
  "stream-get-channel": StreamGetChannelMessage,
  "stream-get-live-list": StreamGetLiveListMessage,
  "stream-search-channel": StreamSearchChannelMessage,
  "stream-search-live": StreamSearchLiveMessage,
};

type Payload<T extends PayloadType> = (typeof PAYLOAD_MAP)[T];
export type RequestPayload<T extends PayloadType> = Payload<T>["request"];
export type ResponsePayload<T extends PayloadType> = Payload<T>["response"];
export type PayloadType = keyof typeof PAYLOAD_MAP;

export interface PayloadSchema {
  request: unknown;
  response?: unknown;
}
