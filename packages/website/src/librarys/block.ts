import {
  BLOCK_TYPE_CHAT_NAME,
  BLOCK_TYPE_STREAM_NAME,
} from "@web/scripts/constants.ts";
import { createStore } from "jotai";
import { MdForum, MdSmartDisplay } from "react-icons/md";

export type Store = ReturnType<typeof createStore>;

export type BlockType = "stream" | "chat";

// TODO: 언젠가는 @api의 Platform으로 통합시키기
export type BlockPlatform = "chzzk" | "youtube";

export type BlockPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type BlockChannel = {
  platform: BlockPlatform;
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  liveId: string | null;
  liveStatus: boolean;
  liveTitle: string;
  liveThumbnailUrl: string;
  lastUpdate: number | null;
};

export type BlockMixer = {
  volume: number;
  lock: boolean;
  muted: boolean;
};

export type BlockPlayer = {
  volume: number;
  muted: boolean;
};

export type BlockStatus = {
  // 블록에 Drag & Drop 요소를 드롭할 수 있는가?
  droppable: boolean;

  // 블록을 새로고침 해야하는가?
  refresh: boolean;

  // 블록 iframe에 src를 할당하여 표시하는가?
  enabled: boolean;

  // 블록 iframe 위에 로딩 오버레이를 표시해야 하는가?
  loading: boolean;

  // 블록이 에러를 표시하는가?
  error: null | "adult" | "offline" | "error";
};

export type BlockOptions = {
  zoom: number;
};

export type Block = {
  id: number;
  type: BlockType;
  status: BlockStatus;
  position: BlockPosition;
  channel: BlockChannel | null;
  mixer: BlockMixer;
  player: BlockPlayer;
  options: BlockOptions;
};

export type PreviewBlockStatus = "create" | "modify" | "inactive";

export type PreviewBlockHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "right"
  | "bottom"
  | "left";

export type PreviewBlock = {
  status: PreviewBlockStatus;
  position: BlockPosition | null;
  linkedBlockId: number | null;
  handle: PreviewBlockHandle | null;
};

export function getBlockTypeName(type: BlockType) {
  switch (type) {
    case "stream":
      return BLOCK_TYPE_STREAM_NAME;
    case "chat":
      return BLOCK_TYPE_CHAT_NAME;
  }
}

export function getBlockTypeIcon(type: BlockType) {
  switch (type) {
    case "stream":
      return MdSmartDisplay;
    case "chat":
      return MdForum;
  }
}
