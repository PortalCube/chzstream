import MixerItem from "@web/components/modal/mixer/MixerItem.tsx";
import {
  blockListAtom,
  layoutModeAtom,
  nextBlockIdAtom,
} from "@web/librarys/app.ts";
import { BlockChannel, BlockPosition, BlockType } from "@web/librarys/block.ts";
import {
  fetchChzzkChannelAtom,
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
  (get, set, preset: PresetItem, channels: BlockChannel[] = []) => {
    const blockList = get(blockListAtom);
    const layoutMode = get(layoutModeAtom);

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
          set(modifyBlockAtom, { id, position, status: layoutMode === "view" });
        } else {
          // 프리셋에 더 이상 해당 유형의 블록이 남아있지 않다면 제거
          set(removeBlockAtom, id);
        }
      } else if (type === "chat") {
        if (chatIndex < chatBlocks.length) {
          const position = chatBlocks[chatIndex++].position;
          set(modifyBlockAtom, { id, position, status: layoutMode === "view" });
        } else {
          set(removeBlockAtom, id);
        }
      }
    }

    // 새로 추가되는 스트리밍 블록을 삽입
    while (streamIndex < streamBlocks.length) {
      const id = set(pushBlockAtom, streamBlocks[streamIndex++].position);
      const channel = channels.shift();
      if (channel !== undefined) {
        set(modifyBlockAtom, { id, channel, status: layoutMode === "view" });
      }
    }

    // 새로 추가되는 채널 블록을 삽입
    while (chatIndex < chatBlocks.length) {
      const id = set(pushBlockAtom, chatBlocks[chatIndex++].position);
      set(modifyBlockAtom, { id, type: "chat", status: layoutMode === "view" });
    }
  }
);

export const pushChannelWithDefaultPresetAtom = atom(
  null,
  async (get, set, channel: BlockChannel) => {
    const layoutMode = get(layoutModeAtom);

    const streamBlock = get(blockListAtom).filter(
      (item) => item.type === "stream"
    );

    // 비어있는 스트리밍 블록을 찾고, 존재하면 그 블록에 채널을 넣기기
    const blankStreamBlock = streamBlock.find((item) => item.channel === null);
    if (blankStreamBlock !== undefined) {
      set(modifyBlockAtom, {
        id: blankStreamBlock.id,
        channel,
        status: layoutMode === "view",
      });
      return;
    }

    // 현재 활성화 블록 갯수 체크
    const channelCount = streamBlock.filter(
      (item) => item.channel !== null
    ).length;

    // 활성화 블록 갯수 + 1개 블록을 갖는 프리셋을 찾기
    const preset = get(presetListAtom).find(
      (item) => item.streamCount === channelCount + 1 && item.chatCount === 0
    );

    // 프리셋이 존재하지 않으면, 아무것도 안함
    if (preset === undefined) return;

    // 프리셋이 존재한다면, 전달받은 채널과 함께 적용
    set(applyPresetItemAtom, preset, [channel]);
  }
);

// 새로운 프리셋 아이템 생성
export const createPresetItemAtom = atom(
  null,
  (get, _set, category: PresetCategory) => {
    const blockList = get(blockListAtom);

    const blocks = blockList.map((block) => ({
      type: block.type,
      position: block.position,
    }));

    return {
      category,
      blocks,
    };
  }
);

// 개발 전용
export const exportPresetListAtom = atom((_get) => {
  return PRESET_LIST.map((item) => ({
    ...item,
    blocks: item.blocks.sort((a, b) => {
      if (a.position.top < b.position.top) return -1;
      if (a.position.top > b.position.top) return 1;
      if (a.position.left < b.position.left) return -1;
      if (a.position.left > b.position.left) return 1;
      return 0;
    }),
  })).sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;

    const filter = (item: PresetItemBase) =>
      item.blocks.filter((block) => block.type === "stream");
    const countA = filter(a).length;
    const countB = filter(b).length;

    if (countA < countB) return -1;
    if (countA > countB) return 1;

    if (a.default === true) return -1;
    if (b.default === true) return 1;

    return 0;
  });
});
