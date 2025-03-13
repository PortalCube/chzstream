import { createStore } from "jotai";
import {
  BLOCK_TYPE_CHAT_NAME,
  BLOCK_TYPE_STREAM_NAME,
} from "@web/scripts/constants.ts";
import { MdForum, MdSmartDisplay } from "react-icons/md";

export type Store = ReturnType<typeof createStore>;

export type BlockType = "stream" | "chat";

export type BlockPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type BlockChannel = {
  uuid: string;
  name: string;
  title: string;
  thumbnailUrl: string;
  iconUrl: string;
  lastUpdate: number | null;
};

export type BlockMixer = {
  volume: number;
  quality: number;
  lock: boolean;
  muted: boolean;
};

export type BlockPlayer = {
  volume: number;
  quality: number;
  muted: boolean;
};

export type Block = {
  id: number;
  type: BlockType;
  status: boolean;
  position: BlockPosition;
  channel: BlockChannel | null;
  mixer: BlockMixer;
  player: BlockPlayer;
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
