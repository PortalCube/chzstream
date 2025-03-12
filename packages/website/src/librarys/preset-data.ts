import { PresetItem } from "@web/librarys/preset.ts";

export const PRESET_LIST: PresetItem[] = [
  {
    name: "채널 1개, 채팅 1개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 19,
          height: 24,
        },
      },
      {
        type: "chat",
        position: {
          top: 0,
          left: 19,
          width: 5,
          height: 24,
        },
      },
    ],
  },
  {
    name: "채널 2개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 12,
          height: 24,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 12,
          height: 24,
        },
      },
    ],
  },
  {
    name: "채널 2개 #2",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 24,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 0,
          width: 24,
          height: 12,
        },
      },
    ],
  },
  {
    name: "채널 2개, 채팅 2개 #1",
    category: "16:9",
    blocks: [
      {
        type: "chat",
        position: {
          top: 0,
          left: 0,
          width: 4,
          height: 24,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 4,
          width: 8,
          height: 24,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 8,
          height: 24,
        },
      },
      {
        type: "chat",
        position: {
          top: 0,
          left: 20,
          width: 4,
          height: 24,
        },
      },
    ],
  },
  {
    name: "채널 2개, 채팅 2개 #2",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 19,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 0,
          width: 19,
          height: 12,
        },
      },
      {
        type: "chat",
        position: {
          top: 12,
          left: 19,
          width: 5,
          height: 12,
        },
      },
      {
        type: "chat",
        position: {
          top: 0,
          left: 19,
          width: 5,
          height: 12,
        },
      },
    ],
  },
  {
    name: "채널 3개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 12,
          height: 24,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 12,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 12,
          height: 12,
        },
      },
    ],
  },
  {
    name: "채널 4개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 0,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 12,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 12,
          height: 12,
        },
      },
    ],
  },
  {
    name: "채널 5개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 0,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 12,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 0,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 8,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 16,
          width: 8,
          height: 12,
        },
      },
    ],
  },
  {
    name: "채널 5개, 채팅 2개 #1",
    category: "16:9",
    blocks: [
      {
        type: "stream",
        position: {
          top: 0,
          left: 4,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 0,
          left: 12,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 0,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 8,
          width: 8,
          height: 12,
        },
      },
      {
        type: "stream",
        position: {
          top: 12,
          left: 16,
          width: 8,
          height: 12,
        },
      },
      {
        type: "chat",
        position: {
          top: 0,
          left: 20,
          width: 4,
          height: 12,
        },
      },
      {
        type: "chat",
        position: {
          top: 0,
          left: 0,
          width: 4,
          height: 12,
        },
      },
    ],
  },
];
