import { createStore } from "jotai";
import {
  BLOCK_TYPE_CHAT_NAME,
  BLOCK_TYPE_STREAM_NAME,
} from "src/scripts/constants.ts";
import { MdForum, MdSmartDisplay } from "react-icons/md";

export type Store = ReturnType<typeof createStore>;

export enum BlockType {
  Stream = "steam",
  Chat = "chat",
}

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
  lock: boolean;
  position: BlockPosition;
  channel: BlockChannel | null;
  mixer: BlockMixer;
  player: BlockPlayer;
};

export enum PreviewBlockStatus {
  Create = "create", // 생성 모드
  Modify = "modify", // 수정 모드
  Inactive = "inactive", // 비활성화
}

export enum PreviewBlockHandle {
  TopLeft = "top-left",
  Top = "top",
  TopRight = "top-right",
  Left = "left",
  Right = "right",
  BottomLeft = "bottom-left",
  Bottom = "bottom",
  BottomRight = "bottom-right",
}

export type PreviewBlock = {
  status: PreviewBlockStatus;
  position: BlockPosition;
  linkedBlockId: number | null;
  handle: PreviewBlockHandle | null;
};

export function getBlockTypeName(type: BlockType) {
  switch (type) {
    case BlockType.Stream:
      return BLOCK_TYPE_STREAM_NAME;
    case BlockType.Chat:
      return BLOCK_TYPE_CHAT_NAME;
  }
}

export function getBlockTypeIcon(type: BlockType) {
  switch (type) {
    case BlockType.Stream:
      return MdSmartDisplay;
    case BlockType.Chat:
      return MdForum;
  }
}
