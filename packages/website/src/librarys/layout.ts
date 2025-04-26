import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { fetchBlockChannelAtom } from "@web/librarys/api-client";
import {
  blockListAtom,
  layoutModeAtom,
  nextBlockIdAtom,
} from "@web/librarys/app.ts";
import {
  Block,
  BlockChannel,
  BlockOptions,
  BlockPosition,
  BlockStatus,
} from "@web/librarys/block.ts";
import {
  defaultMixerItemAtom,
  setSoloAtom,
  soloBlockIdAtom,
  updateMuteAtom,
} from "@web/librarys/mixer.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { pushChannelWithDefaultPresetAtom } from "@web/librarys/preset.ts";
import { WritableDraft } from "immer";
import { atom } from "jotai";

export type LayoutMode = "view" | "modify";

export const pushBlockAtom = atom(null, (get, set, position: BlockPosition) => {
  const nextBlockId = get(nextBlockIdAtom);
  const defaultMixerItem = get(defaultMixerItemAtom);

  const block: Block = {
    id: nextBlockId,
    type: "stream",
    status: {
      droppable: true,
      refresh: false,
      enabled: false,
      loading: false,
      error: null,
    },
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
    options: {
      zoom: 1.0,
      objectFit: "contain",
      objectPosition: {
        horizontal: "center",
        vertical: "center",
      },
    },
  };

  set(blockListAtom, (prev) => [...prev, block]);
  set(nextBlockIdAtom, (prev) => prev + 1);

  return block.id;
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

export const modifyBlockStatusAtom = atom(
  null,
  (_get, set, id: number, status: Partial<BlockStatus>) => {
    set(blockListAtom, (prev) => {
      const index = prev.findIndex((item) => item.id === id);

      if (index === -1) {
        throw new Error(`Block not found: ${id}`);
      }

      prev[index].status = { ...prev[index].status, ...status };
    });
  }
);

export const modifyBlockOptionsAtom = atom(
  null,
  (_get, set, id: number, options: Partial<BlockOptions>) => {
    set(blockListAtom, (prev) => {
      const index = prev.findIndex((item) => item.id === id);

      if (index === -1) {
        throw new Error(`Block not found: ${id}`);
      }

      prev[index].options = { ...prev[index].options, ...options };
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

export const activateBlockAtom = atom(null, (get, set) => {
  const isRestrictedMode = get(messageClientAtom) === null;
  set(blockListAtom, (prev) => {
    prev.forEach((item) => {
      if (item.channel === null) return;
      if (item.status.enabled) return;

      item.status = {
        ...item.status,
        enabled: true,
        loading: isRestrictedMode === false,
        error: null,
      };
    });
  });
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

export const setBlockChannelAtom = atom(
  null,
  (get, set, id: number, channel: BlockChannel | null) => {
    const isRestrictedMode = get(messageClientAtom) === null;
    const layoutMode = get(layoutModeAtom);

    set(updateBlockAtom, id, (block) => {
      block.channel = channel;

      const loading = block.channel !== null && isRestrictedMode === false;
      const enabled = layoutMode === "view";

      block.status = {
        ...block.status,
        loading,
        enabled,
        error: null,
      };

      console.log({ ...block.status });
    });
  }
);

export const refreshChannelAtom = atom(null, async (get, set) => {
  const date = Date.now();
  const delay = 1000 * 60;

  // 시청 중일때는 불필요하게 fetch하지 않음
  if (get(layoutModeAtom) === "view") return;

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
    const channel = await set(fetchBlockChannelAtom, {
      platform: "chzzk",
      id: block.channel!.channelId,
    });

    // DONT USE "setBlockChannel" HERE
    set(modifyBlockAtom, { id: block.id, channel });
  }
});

export const activateViewModeAtom = atom(null, (_get, set) => {
  set(layoutModeAtom, "view");
  set(activateBlockAtom);
});

export const activateEditModeAtom = atom(null, (_get, set) => {
  set(layoutModeAtom, "modify");
});

export const switchLayoutModeAtom = atom(null, (get, set) => {
  const mode = get(layoutModeAtom);
  if (mode === "view") {
    set(activateEditModeAtom);
  } else if (mode === "modify") {
    set(activateViewModeAtom);
  }
});

export const lockBlockAtom = atom(null, (_get, set) => {
  set(blockListAtom, (prev) => prev.map((item) => ({ ...item, lock: true })));
});

export const quickBlockAddAtom = atom(null, (_get, set) => {
  set(openSearchModalAtom, async (_channels) => {
    const channels: BlockChannel[] = [];

    for (const item of _channels) {
      channels.push(
        await set(fetchBlockChannelAtom, { platform: "chzzk", id: item.uuid })
      );
    }

    set(pushChannelWithDefaultPresetAtom, channels);
  });
});

export const sendBlockOptionsAtom = atom(
  null,
  async (get, _set, id: number) => {
    const messageClient = get(messageClientAtom);
    if (messageClient === null) return;

    const blockList = get(blockListAtom);
    const block = blockList.find((item) => item.id === id);

    if (block === undefined) return;

    const websiteId = messageClient.id.id;

    messageClient.send(
      "video-style",
      {
        objectFit: block.options.objectFit,
        objectPosition: block.options.objectPosition,
      },
      {
        type: "content",
        websiteId: websiteId,
        blockId: id,
      }
    );
  }
);
