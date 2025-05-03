import { RequestPayload } from "@chzstream/message";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { blockListAtom } from "@web/librarys/app.ts";
import { BlockMixer } from "@web/librarys/block.ts";
import {
  getStoragePlayerMuted,
  getStoragePlayerVolume,
  setStoragePlayerMuted,
  setStoragePlayerVolume,
} from "@web/scripts/storage.ts";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export type MixerItem = {
  id: number | null;
  icon: string | null;
  name: string;
  mixer: BlockMixer;
};

export const defaultMixerItemAtom = atomWithImmer<MixerItem>({
  id: null,
  icon: null,
  name: "기본값",
  mixer: {
    volume: 0,
    lock: false,
    muted: false,
  },
});

export const batchMixerItemAtom = atomWithImmer<MixerItem>({
  id: 0,
  icon: null,
  name: "모든 블록에 적용",
  mixer: {
    volume: 50,
    lock: false,
    muted: false,
  },
});

export const soloBlockIdAtom = atom<number | null>(null);

export const mixerItemsAtom = atom<MixerItem[]>((get) => {
  const blockList = get(blockListAtom);
  return blockList
    .filter((block) => block.type === "stream")
    .map((block) => ({
      id: block.id,
      icon: block.channel?.channelImageUrl ?? null,
      name: block.channel?.channelName ?? "채널 없음",
      mixer: block.mixer,
    }));
});

export const loadDefaultMixerAtom = atom(null, async (_get, set) => {
  const volume = await getStoragePlayerVolume();
  const muted = await getStoragePlayerMuted();

  set(defaultMixerItemAtom, (draft) => {
    draft.mixer = {
      volume,
      lock: false,
      muted,
    };
  });
});

export const setupMixerAtom = atom(null, (_get, set) => {
  set(blockListAtom, (draft) => {
    draft.forEach((item) => {
      if (item.type !== "stream") return;
      if (item.status.enabled === false) return;

      item.mixer.volume = item.player.volume;
      item.mixer.muted = item.player.muted;
    });
  });
});

/*===========================*
 * Set
 *===========================*/

export const setVolumeAtom = atom(
  null,
  (_get, set, id: number | null, volume: number) => {
    let newValue: number | null = null;

    if (id === 0) {
      newValue = set(setBatchVolumeAtom, volume);
    } else if (id === null) {
      newValue = set(setDefaultVolumeAtom, volume);
    } else {
      newValue = set(setSingleVolumeAtom, id, volume);
    }

    return newValue;
  }
);

export const setMuteAtom = atom(
  null,
  (_get, set, id: number | null, mute: boolean | null) => {
    let newValue: boolean | null = null;

    if (id === 0) {
      newValue = set(setBatchMuteAtom, mute);
    } else if (id === null) {
      newValue = set(setDefaultMuteAtom, mute);
    } else {
      newValue = set(setSingleMuteAtom, id, mute);
    }

    return newValue;
  }
);

export const setLockAtom = atom(
  null,
  (_get, set, id: number | null, lock: boolean | null) => {
    let newValue: boolean | null = null;

    if (id === 0) {
      // newValue = set(setDefaultLockAtom, lock);
    } else if (id === null) {
      // newValue = set(setBatchLockAtom, lock);
    } else {
      newValue = set(setSingleLockAtom, id, lock);
    }

    return newValue;
  }
);

export const setSoloAtom = atom(
  null,
  (_get, set, id: number | null, solo: boolean | null) => {
    let newValue: boolean | null = null;

    if (id === 0) {
      // newValue = set(setDefaultSoloAtom, solo);
    } else if (id === null) {
      // newValue = set(setBatchSoloAtom, solo);
    } else {
      newValue = set(setSingleSoloAtom, id, solo);
    }

    return newValue;
  }
);

/*===========================*
 * Single
 *===========================*/

export const setSingleVolumeAtom = atom(
  null,
  (get, set, id: number, volume: number): number | null => {
    const blockList = get(blockListAtom);

    const index = blockList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const block = blockList[index];
    if (block.mixer.volume === volume) return null;

    set(blockListAtom, (draft) => {
      const item = draft[index];
      item.mixer.volume = volume;
      set(updateVolumeAtom, id);
    });

    return volume;
  }
);

export const setSingleMuteAtom = atom(
  null,
  (get, set, id: number, mute: boolean | null): boolean | null => {
    const blockList = get(blockListAtom);

    const index = blockList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const block = blockList[index];
    if (block.mixer.muted === mute) return null;

    const newValue = mute !== null ? mute : !block.mixer.muted;

    set(blockListAtom, (draft) => {
      const item = draft[index];
      item.mixer.muted = newValue;

      set(updateVolumeAtom, id);
    });

    return newValue;
  }
);

export const setSingleLockAtom = atom(
  null,
  (get, set, id: number, lock: boolean | null): boolean | null => {
    const blockList = get(blockListAtom);

    const index = blockList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const block = blockList[index];
    if (block.mixer.lock === lock) return null;

    const newValue = lock !== null ? lock : !block.mixer.lock;

    set(blockListAtom, (draft) => {
      const item = draft[index];
      item.mixer.lock = newValue;
    });

    return newValue;
  }
);

export const setSingleSoloAtom = atom(
  null,
  (get, set, id: number, solo: boolean | null): boolean | null => {
    const soloBlockId = get(soloBlockIdAtom);
    const currentSolo = soloBlockId === id;

    if (solo !== null && solo === currentSolo) return null;

    const newValue = solo !== null ? solo : soloBlockId !== id;

    if (newValue) {
      set(soloBlockIdAtom, id);
      return true;
    } else {
      set(soloBlockIdAtom, null);
      return false;
    }
  }
);

/*===========================*
 * Default
 *===========================*/

export const setDefaultVolumeAtom = atom(
  null,
  (get, set, volume: number): number | null => {
    const defaultMixerItem = get(defaultMixerItemAtom);
    if (defaultMixerItem.mixer.volume === volume) return null;

    set(defaultMixerItemAtom, (draft) => {
      draft.mixer.volume = volume;
    });

    setStoragePlayerVolume(volume);

    return volume;
  }
);

export const setDefaultMuteAtom = atom(
  null,
  (get, set, mute: boolean | null): boolean | null => {
    const defaultMixerItem = get(defaultMixerItemAtom);
    if (defaultMixerItem.mixer.muted === mute) return null;

    const newValue = mute !== null ? mute : !defaultMixerItem.mixer.muted;

    set(defaultMixerItemAtom, (draft) => {
      draft.mixer.muted = newValue;
    });

    setStoragePlayerMuted(newValue);

    return newValue;
  }
);

/*===========================*
 * Batch
 *===========================*/

export const setBatchVolumeAtom = atom(
  null,
  (get, set, volume: number): number | null => {
    set(batchMixerItemAtom, (draft) => {
      draft.mixer.volume = volume;
    });

    const mixerItems = get(mixerItemsAtom);
    mixerItems.forEach((item) => {
      if (item.mixer.lock) return;
      set(setVolumeAtom, item.id, volume);
    });

    return volume;
  }
);

export const setBatchMuteAtom = atom(
  null,
  (get, set, mute: boolean | null): boolean | null => {
    const batchMixerItem = get(batchMixerItemAtom);

    const newValue = mute !== null ? mute : !batchMixerItem.mixer.muted;

    set(batchMixerItemAtom, (draft) => {
      draft.mixer.muted = newValue;
    });

    const mixerItems = get(mixerItemsAtom);
    mixerItems.forEach((item) => {
      if (item.mixer.lock) return;
      set(setMuteAtom, item.id, newValue);
    });

    return newValue;
  }
);

/*===========================*
 * Update
 *===========================*/

export const updateVolumeAtom = atom(null, (_get, set, id: number) => {
  if (id === 0) {
    set(updateBatchVolumeAtom);
  } else {
    set(updateSingleVolumeAtom, id);
  }
});

export const updateSingleVolumeAtom = atom(null, (get, set, id: number) => {
  const blockList = get(blockListAtom);
  const index = blockList.findIndex((item) => item.id === id);

  if (index === -1) return;

  set(blockListAtom, (draft) => {
    const item = draft[index];
    item.player.volume = item.mixer.volume;

    set(sendPlayerControlAtom, id, {
      volume: item.player.volume,
    });
  });
});

export const updateBatchVolumeAtom = atom(null, (_get, set) => {
  set(blockListAtom, (draft) => {
    draft.forEach((item) => {
      item.player.volume = item.mixer.volume;

      set(sendPlayerControlAtom, item.id, {
        volume: item.player.volume,
      });
    });
  });
});

export const updateMuteAtom = atom(null, (_get, set, id: number) => {
  if (id === 0) {
    set(updateBatchMuteAtom);
  } else {
    set(updateSingleMuteAtom, id);
  }
});

export const updateSingleMuteAtom = atom(null, (get, set, id: number) => {
  const blockList = get(blockListAtom);
  const index = blockList.findIndex((item) => item.id === id);

  if (index === -1) return;

  const soloBlockId = get(soloBlockIdAtom);

  set(blockListAtom, (draft) => {
    const item = draft[index];

    item.player.muted = item.mixer.muted;

    const forceMute = soloBlockId !== null && soloBlockId !== item.id;

    set(sendPlayerControlAtom, item.id, {
      muted: forceMute ? true : item.mixer.muted,
    });
  });
});

export const updateBatchMuteAtom = atom(null, (get, set) => {
  const soloBlockId = get(soloBlockIdAtom);

  set(blockListAtom, (draft) => {
    draft.forEach((item) => {
      item.player.muted = item.mixer.muted;

      const forceMute = soloBlockId !== null && soloBlockId !== item.id;

      set(sendPlayerControlAtom, item.id, {
        muted: forceMute ? true : item.mixer.muted,
      });
    });
  });
});

/*===========================*
 * On Message
 *===========================*/

export const applyPlayerControlAtom = atom(
  null,
  async (get, set, id: number) => {
    const blockList = get(blockListAtom);
    const block = blockList.find((item) => item.id === id);
    if (block === undefined) return;

    const soloBlockId = get(soloBlockIdAtom);

    const { volume, muted } = block.player;

    const forceMute = soloBlockId !== null && soloBlockId !== id;

    set(sendPlayerControlAtom, id, {
      volume,
      muted: forceMute ? true : muted,
    });
  }
);

export const updatePlayerControlAtom = atom(
  null,
  (get, set, id: number, data: RequestPayload<"video-status">) => {
    const soloBlockId = get(soloBlockIdAtom);

    const blockList = get(blockListAtom);
    const index = blockList.findIndex((item) => item.id === id);

    if (index === -1) return;

    const block = blockList[index];

    const forceMute = soloBlockId !== null && soloBlockId !== id;

    const isVolumeChanged =
      data.volume !== block.player.volume ||
      data.muted !== (forceMute ? true : block.mixer.muted);
    const isDeactived = soloBlockId !== null && soloBlockId !== id;

    // Solo가 설정된 상태에서 볼륨을 조절하는 경우 Solo 해제
    if (isVolumeChanged && isDeactived) {
      set(soloBlockIdAtom, null);
    }

    set(blockListAtom, (draft) => {
      const item = draft[index];

      if (data.volume !== undefined && item.mixer.volume !== data.volume) {
        item.mixer.volume = data.volume;
        item.player.volume = data.volume;
      }

      if (data.muted !== undefined && item.mixer.muted !== data.muted) {
        item.mixer.muted = data.muted;
        item.player.muted = data.muted;
      }
    });

    if (isVolumeChanged && isDeactived) {
      set(updateMuteAtom, 0);
    }
  }
);

const sendPlayerControlAtom = atom(
  null,
  (get, _set, id: number, data: RequestPayload<"video-status">) => {
    const messageClient = get(messageClientAtom);
    if (messageClient === null) return;

    const websiteId = messageClient.id.id;

    messageClient.send("video-status", data, {
      type: "content",
      websiteId: websiteId,
      blockId: id,
    });
  }
);
