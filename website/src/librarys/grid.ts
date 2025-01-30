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

const initialBlockList: Block[] = [];
let initialId = 0;

export enum ApplicationMode {
  View = "view",
  Modify = "modify",
}

export const blockListAtom = atomWithImmer<Block[]>(initialBlockList);
export const nextBlockIdAtom = atom<number>(initialId);
export const applicationModeAtom = atom<ApplicationMode>(
  ApplicationMode.Modify
);
export const mouseIsTopAtom = atom<boolean>(false);
export const gridSizeAtom = atom<[number, number]>([0, 0]);

export function addBlock(
  id: number,
  top: number,
  left: number,
  width: number = 1,
  height: number = 1
) {
  const block: Block = {
    id: id,
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
  };

  return (draft: Draft<Block[]>) => {
    draft.push(block);
  };
}

export function findBlock(id: number) {
  const [blockList] = useAtom(blockListAtom);
  return (
    blockList.find((block) => block.id === id) ?? {
      id: -1,
      type: BlockType.Stream,
      status: MessageClient.active === false,
      lock: true,
      position: {
        top: 0,
        left: 0,
        width: 1,
        height: 1,
      },
      channel: null,
    }
  );
}

export function _findBlock(id: number, blockList: Block[]) {
  return (
    blockList.find((block) => block.id === id) ?? {
      id: -1,
      type: BlockType.Stream,
      status: MessageClient.active === false,
      lock: true,
      position: {
        top: 0,
        left: 0,
        width: 1,
        height: 1,
      },
      channel: null,
    }
  );
}

export function removeBlock(id: number) {
  return (draft: Draft<Block[]>) => {
    return draft.filter((item) => item.id !== id);
  };
}

export function setBlockPosition(id: number | null, position: BlockPosition) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    item.position.left = position.left;
    item.position.top = position.top;
    item.position.width = position.width;
    item.position.height = position.height;
  };
}

export function setBlockUuid(id: number, uuid: string) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    if (item.channel === null) {
      return;
    }

    item.channel.uuid = uuid;
  };
}

export function setBlockName(id: number, name: string) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    if (item.channel === null) {
      return;
    }

    item.channel.name = name;
  };
}

export function setBlockTitle(id: number, title: string) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    if (item.channel === null) {
      return;
    }

    item.channel.title = title;
  };
}

export function setBlockType(id: number, type: BlockType) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    item.type = type;

    if (MessageClient.active) {
      item.status = false;
    }
  };
}

export function setBlockLock(id: number, lock: boolean) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    item.lock = lock;
  };
}

export function setBlockChannel(id: number, channel: BlockChannel) {
  return (draft: Draft<Block[]>) => {
    const item = draft.find((item) => item.id === id);

    if (item === undefined) {
      return;
    }

    item.channel = channel;

    if (MessageClient.active) {
      item.status = false;
    }
  };
}

export function activateBlockStatus() {
  return (draft: Draft<Block[]>) => {
    for (const item of draft) {
      item.status = true;
    }
  };
}

// TODO: 위의 함수를 모두 useGrid에 넣기
export function useGrid() {
  const [blockList, setBlockList] = useAtom(blockListAtom);
  const [mode, setMode] = useAtom(applicationModeAtom);

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

    setBlockList(
      setBlockChannel(id, {
        uuid,
        name,
        title,
        thumbnailUrl,
        iconUrl,
      })
    );

    if (mode === ApplicationMode.View) {
      setBlockList(activateBlockStatus());
    }
  }

  return {
    updateChannel,
  };
}
