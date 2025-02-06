import { Draft } from "immer";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { Block, BlockChannel, BlockPosition, BlockType } from "./block.ts";
import {
  MessageClient,
  requestChzzkChannelInfo,
  requestChzzkLiveInfo,
} from "src/scripts/message.ts";
import { getProfileImageUrl } from "./chzzk-util.ts";
import { useMixer } from "./mixer.ts";

const initialBlockList: Block[] = [];
const initialId = 1;

export enum LayoutMode {
  View = "view",
  Modify = "modify",
}

export const blockListAtom = atomWithImmer<Block[]>(initialBlockList);
export const nextBlockIdAtom = atom<number>(initialId);
export const mouseIsTopAtom = atom<boolean>(false);
export const layoutModeAtom = atom<LayoutMode>(LayoutMode.Modify);
export const layoutSizeAtom = atom<[number, number]>([0, 0]);

export function useLayout() {
  const { globalItem } = useMixer();
  const [blockList, setBlockList] = useAtom(blockListAtom);
  const [nextBlockId, setNextBlockId] = useAtom(nextBlockIdAtom);
  const [layoutMode, setLayoutMode] = useAtom(layoutModeAtom);

  function addBlock(
    top: number,
    left: number,
    width: number = 1,
    height: number = 1
  ) {
    const block: Block = {
      id: nextBlockId,
      type: BlockType.Stream,
      status: MessageClient.active === false,
      lock: true,
      position: {
        top,
        left,
        width,
        height,
      },
      channel: null,
      volume: globalItem.volume,
      quality: globalItem.quality,
    };

    setBlockList((draft) => {
      draft.push(block);
    });

    setNextBlockId((draft) => {
      return draft + 1;
    });
  }

  function findBlock(id: number): Block {
    const block = blockList.find((item) => item.id === id);

    if (block === undefined) {
      throw new Error(`Block not found: ${id}`);
    }

    return block;
  }

  function removeBlock(id: number) {
    setBlockList((draft) => {
      return draft.filter((item) => item.id !== id);
    });
  }

  function clearBlock() {
    setBlockList([]);
  }

  function setBlockPosition(id: number, position: BlockPosition) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      item.position.left = position.left;
      item.position.top = position.top;
      item.position.width = position.width;
      item.position.height = position.height;
    });
  }

  function swapBlockPosition(sourceId: number, targetId: number) {
    setBlockList((draft) => {
      const sourceItem = draft.find((item) => item.id === sourceId);
      const targetItem = draft.find((item) => item.id === targetId);

      if (sourceItem === undefined || targetItem === undefined) {
        return;
      }

      const sourcePosition = sourceItem.position;
      const targetPosition = targetItem.position;

      sourceItem.position = targetPosition;
      targetItem.position = sourcePosition;
    });
  }

  function setBlockUuid(id: number, uuid: string) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      if (item.channel === null) {
        return;
      }

      item.channel.uuid = uuid;
    });
  }

  function setBlockName(id: number, name: string) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      if (item.channel === null) {
        return;
      }

      item.channel.name = name;
    });
  }

  function setBlockTitle(id: number, title: string) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      if (item.channel === null) {
        return;
      }

      item.channel.title = title;
    });
  }

  function setBlockType(id: number, type: BlockType) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      item.type = type;

      if (MessageClient.active) {
        item.status = false;
      }
    });
  }

  function setBlockLock(id: number, lock: boolean) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      item.lock = lock;
    });
  }

  function setBlockChannel(id: number, channel: BlockChannel) {
    setBlockList((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        return;
      }

      item.channel = channel;

      if (MessageClient.active) {
        item.status = false;
      }
    });
  }

  function activateBlockStatus() {
    setBlockList((draft) => {
      for (const item of draft) {
        item.status = true;
      }
    });
  }

  async function updateChannel(id: number, uuid: string) {
    const channelResponse = await requestChzzkChannelInfo(uuid);

    const liveResponse =
      (channelResponse?.openLive && (await requestChzzkLiveInfo(uuid))) ||
      undefined;

    const name = channelResponse?.channelName ?? "알 수 없음";
    const title = liveResponse?.liveTitle ?? "현재 오프라인 상태입니다";
    const thumbnailUrl =
      liveResponse?.liveImageUrl?.replace("{type}", "720") ?? "";
    const iconUrl = getProfileImageUrl(channelResponse?.channelImageUrl);

    setBlockChannel(id, {
      uuid,
      name,
      title,
      thumbnailUrl,
      iconUrl,
    });

    if (layoutMode === LayoutMode.View) {
      activateBlockStatus();
    }
  }

  function activateViewMode() {
    setLayoutMode(LayoutMode.View);
    activateBlockStatus();
  }

  function activateEditMode() {
    setLayoutMode(LayoutMode.Modify);
  }

  function switchLayoutMode() {
    if (layoutMode === LayoutMode.View) {
      activateEditMode();
    } else if (layoutMode === LayoutMode.Modify) {
      activateViewMode();
    }
  }

  return {
    nextBlockId,
    blockList,
    addBlock,
    findBlock,
    removeBlock,
    clearBlock,
    setBlockPosition,
    setBlockUuid,
    setBlockName,
    setBlockTitle,
    setBlockType,
    setBlockLock,
    swapBlockPosition,
    activateBlockStatus,
    setBlockChannel,
    updateChannel,
    layoutMode,
    setLayoutMode,
    activateViewMode,
    activateEditMode,
    switchLayoutMode,
  };
}
