import MixerItem from "@web/components/modal/mixer/MixerItem.tsx";
import { blockListAtom, nextBlockIdAtom } from "@web/librarys/app.ts";
import { BlockPosition, BlockType } from "@web/librarys/block.ts";
import {
  modifyBlockAtom,
  pushBlockAtom,
  removeBlockAtom,
} from "@web/librarys/layout.ts";
import { PRESET_LIST } from "@web/librarys/preset-data.ts";
import { atom } from "jotai";

export type PresetCategory = "16:9" | "16:10" | "mobile";

export type PresetItemBase = {
  name?: string;
  category: PresetCategory;
  blocks: {
    position: BlockPosition;
    type: BlockType;
  }[];
  default?: boolean;
};

export type PresetItem = PresetItemBase & {
  description: string;
  streamCount: number;
  chatCount: number;
};

export const presetListAtom = atom<PresetItem[]>((_get) =>
  PRESET_LIST.map((item) => {
    const filter = (type: BlockType) =>
      item.blocks.filter((block) => block.type === type);

    const streamBlocks = filter("stream");
    const chatBlocks = filter("chat");

    const streamCount = streamBlocks.length;
    const chatCount = chatBlocks.length;

    const description =
      chatCount === 0
        ? `채널 ${streamCount}개`
        : `채널 ${streamCount}개, 채팅 ${chatCount}개`;

    return {
      ...item,
      description,
      streamCount,
      chatCount,
    };
  })
);

// 프리셋을 현재 blockList에 적용
export const applyPresetItemAtom = atom(
  null,
  (get, set, preset: PresetItem) => {
    const blockList = get(blockListAtom);

    const streamBlocks = preset.blocks.filter(
      (block) => block.type === "stream"
    );
    const chatBlocks = preset.blocks.filter((block) => block.type === "chat");

    let streamIndex = 0;
    let chatIndex = 0;

    // 기존 블록을 프리셋의 블록으로 변경

    // 현재 존재하는 블록을 하나씩 순회
    for (let i = 0; i < blockList.length; i++) {
      const { id, type } = blockList[i];

      if (type === "stream") {
        if (streamIndex < streamBlocks.length) {
          // 프리셋에 존재하는 같은 유형의 블록으로 위치를 변경
          const position = streamBlocks[streamIndex++].position;
          set(modifyBlockAtom, { id, position });
        } else {
          // 프리셋에 더 이상 해당 유형의 블록이 남아있지 않다면 제거
          set(removeBlockAtom, id);
        }
      } else if (type === "chat") {
        if (chatIndex < chatBlocks.length) {
          const position = chatBlocks[chatIndex++].position;
          set(modifyBlockAtom, { id, position });
        } else {
          set(removeBlockAtom, id);
        }
      }
    }

    // 새로 추가되는 스트리밍 블록을 삽입
    while (streamIndex < streamBlocks.length) {
      set(pushBlockAtom, streamBlocks[streamIndex++].position);
    }

    // 새로 추가되는 채널 블록을 삽입
    while (chatIndex < chatBlocks.length) {
      const id = set(pushBlockAtom, chatBlocks[chatIndex++].position);
      set(modifyBlockAtom, { id, type: "chat" });
    }
  }
);

export const createPresetItemAtom = atom(
  null,
  (get, _set, category: PresetCategory) => {
    const blockList = get(blockListAtom);

    const blocks = blockList.map((block) => ({
      type: block.type,
      position: block.position,
    }));

    const channelCount = blocks.filter(
      (block) => block.type === "stream"
    ).length;
    const chatCount = blocks.filter((block) => block.type === "chat").length;

    const name =
      chatCount === 0
        ? `채널 ${channelCount}개 #`
        : `채널 ${channelCount}개, 채팅 ${chatCount}개 #`;

    return {
      name,
      category,
      blocks,
    };
  }
);
