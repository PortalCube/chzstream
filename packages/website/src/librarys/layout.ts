import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import {
  blockListAtom,
  layoutModeAtom,
  nextBlockIdAtom,
} from "@web/librarys/app.ts";
import {
  Block,
  BlockChannel,
  BlockPosition,
  BlockType,
} from "@web/librarys/block.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import {
  defaultMixerItemAtom,
  setSoloAtom,
  soloBlockIdAtom,
  updateMuteAtom,
} from "@web/librarys/mixer.ts";
import { WritableDraft } from "immer";
import { atom } from "jotai";

export enum LayoutMode {
  View = "view",
  Modify = "modify",
}

export const pushBlockAtom = atom(null, (get, set, position: BlockPosition) => {
  const nextBlockId = get(nextBlockIdAtom);
  const defaultMixerItem = get(defaultMixerItemAtom);
  const isRestrictedMode = get(messageClientAtom) === null;

  const block: Block = {
    id: nextBlockId,
    type: BlockType.Stream,
    // 제한 모드에서는, loading 이벤트를 감지할 수 없으므로 로딩 완료로 지정
    status: isRestrictedMode,
    lock: true,
    position: position,
    channel: null,
    mixer: {
      volume: defaultMixerItem.mixer.volume,
      quality: defaultMixerItem.mixer.quality,
      muted: defaultMixerItem.mixer.muted,
      lock: false,
    },
    player: {
      volume: defaultMixerItem.mixer.volume,
      quality: defaultMixerItem.mixer.quality,
      muted: defaultMixerItem.mixer.muted,
    },
  };

  set(blockListAtom, (prev) => [...prev, block]);
  set(nextBlockIdAtom, (prev) => prev + 1);
});

export const addBlockAtom = atom(null, (get, set, block: Block) => {
  const list = get(blockListAtom);
  const defaultMixerItem = get(defaultMixerItemAtom);

  if (list.find((item) => item.id === block.id) !== undefined) {
    throw new Error(`Block already exists: ${block.id}`);
  }

  block.mixer = {
    volume: defaultMixerItem.mixer.volume,
    quality: defaultMixerItem.mixer.quality,
    muted: defaultMixerItem.mixer.muted,
    lock: false,
  };

  set(blockListAtom, (prev) => [...prev, block]);
});

export const removeBlockAtom = atom(null, (get, set, id: number) => {
  set(blockListAtom, (prev) => prev.filter((item) => item.id !== id));

  const soloBlockId = get(soloBlockIdAtom);

  if (soloBlockId === id) {
    set(setSoloAtom, id, false);
    set(updateMuteAtom, 0);
  }
});

export const clearBlockAtom = atom(null, (_get, set) => {
  set(blockListAtom, []);
  set(nextBlockIdAtom, 1);
  set(soloBlockIdAtom, null);
});

export const modifyBlockAtom = atom(
  null,
  (_get, set, block: Partial<Block> & Pick<Block, "id">) => {
    set(blockListAtom, (prev) => {
      const index = prev.findIndex((item) => item.id === block.id);

      if (index === -1) {
        throw new Error(`Block not found: ${block.id}`);
      }

      prev[index] = { ...prev[index], ...block };
    });
  }
);

export const updateBlockAtom = atom(
  null,
  (_get, set, id: number, update: (block: WritableDraft<Block>) => void) => {
    set(blockListAtom, (prev) => {
      const block = prev.find((item) => item.id === id);

      if (block === undefined) {
        throw new Error(`Block not found: ${id}`);
      }

      update(block);
    });
  }
);

export const activateBlockAtom = atom(null, (_get, set) => {
  set(blockListAtom, (prev) => prev.map((item) => ({ ...item, status: true })));
});

export const swapBlockAtom = atom(
  null,
  (_get, set, sourceId: number, targetId: number) => {
    set(blockListAtom, (prev) => {
      const sourceItem = prev.find((item) => item.id === sourceId);
      const targetItem = prev.find((item) => item.id === targetId);

      if (sourceItem === undefined || targetItem === undefined) {
        return prev;
      }

      [sourceItem.position, targetItem.position] = [
        targetItem.position,
        sourceItem.position,
      ];
    });
  }
);

export const refreshChannelAtom = atom(null, async (get, set) => {
  const date = Date.now();
  const delay = 1000 * 60;

  // 시청 중일때는 불필요하게 fetch하지 않음
  if (get(layoutModeAtom) === LayoutMode.View) return;

  const expiredBlockList = get(blockListAtom).filter((block, index) => {
    if (block.channel === null) return false;
    if (block.channel.lastUpdate === null) return false;
    if (block.channel.lastUpdate + delay > date) return false;

    // null로 마킹하여 fetch의 중복 실행을 방지
    set(blockListAtom, (draft) => {
      const item = draft[index];
      item.channel!.lastUpdate = null;
    });

    return true;
  });

  for (const block of expiredBlockList) {
    await set(fetchChzzkChannelAtom, block.id, block.channel!.uuid);
  }
});

export const fetchChzzkChannelAtom = atom(
  null,
  async (get, set, id: number, uuid: string) => {
    const messageClient = get(messageClientAtom);
    const isRestrictedMode = messageClient === null;
    const blockList = get(blockListAtom);
    const block = blockList.find((item) => item.id === id);

    if (block === undefined) {
      throw new Error(`Block not found: ${id}`);
    }

    const channel: BlockChannel = {
      uuid: uuid,
      name: "알 수 없음",
      title: "현재 오프라인 상태입니다",
      thumbnailUrl: "",
      iconUrl: getProfileImageUrl(),
      lastUpdate: null,
    };

    // 제한 모드 처리
    if (isRestrictedMode) {
      channel.title = "제한 모드에서는 채널 정보를 불러올 수 없습니다";
      set(modifyBlockAtom, { id, channel });
      return;
    }

    // 채널 데이터 가져오기
    const response = await messageClient.request("stream-get-channel", {
      platform: "chzzk",
      id: uuid,
    });

    const data = response.data;
    if (data === null) {
      throw new Error(`Channel not found: ${uuid}`);
    }

    // 가져온 데이터로 채널 정보 업데이트
    channel.name = data.channelName;
    channel.iconUrl = getProfileImageUrl(data.channelImageUrl);
    channel.lastUpdate = Date.now();

    // 방송이 켜진 경우, 제목도 업데이트
    if (data.liveStatus === true) {
      channel.title = data.liveTitle ?? "";
    }

    // TODO: CHZZK 전용 코드 --> 추후 수정
    // 썸네일 이미지가 있는 경우, 이미지 URL 업데이트
    if (data.liveThumbnailUrl !== null) {
      const imageUrl = data.liveThumbnailUrl.replace("{type}", "1080");
      channel.thumbnailUrl = imageUrl + `?t=${channel.lastUpdate}`;
    }

    set(modifyBlockAtom, { id, channel });
  }
);

export const activateViewModeAtom = atom(null, (_get, set) => {
  set(layoutModeAtom, LayoutMode.View);
  set(activateBlockAtom);
});

export const activateEditModeAtom = atom(null, (_get, set) => {
  set(layoutModeAtom, LayoutMode.Modify);
});

export const switchLayoutModeAtom = atom(null, (get, set) => {
  const mode = get(layoutModeAtom);
  if (mode === LayoutMode.View) {
    set(activateEditModeAtom);
  } else if (mode === LayoutMode.Modify) {
    set(activateViewModeAtom);
  }
});
