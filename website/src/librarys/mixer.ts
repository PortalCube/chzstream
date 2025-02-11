import { PlayerControlMessageData } from "@chzstream/message";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useEffect, useMemo } from "react";
import { sendPlayerControl } from "src/scripts/message.ts";
import {
  getStoragePlayerMuted,
  getStoragePlayerQuality,
  getStoragePlayerVolume,
  setStoragePlayerMuted,
  setStoragePlayerQuality,
  setStoragePlayerVolume,
} from "src/scripts/storage.ts";
import { BlockPlayerSetting } from "./block.ts";
import { modalAtom, ModalType } from "./modal.ts";
import { blockListAtom } from "./app.ts";

export type MixerItem = {
  id: number | null;
  name: string;
  setting: BlockPlayerSetting;
};

export const defaultMixerItemAtom = atomWithImmer<MixerItem>({
  id: null,
  name: "기본값",
  setting: {
    quality: 0,
    volume: 0,
    lock: false,
    muted: false,
  },
});

export const batchMixerItemAtom = atomWithImmer<MixerItem>({
  id: 0,
  name: "모든 블록에 적용",
  setting: {
    quality: 0,
    volume: 0,
    lock: false,
    muted: false,
  },
});

export const mixerItemsAtom = atomWithImmer<MixerItem[]>([]);

export const soloBlockIdAtom = atom<number | null>(null);

const BANDWIDTHS = [100, 250, 500, 1200];

export function useMixer() {
  const modal = useAtomValue(modalAtom);
  const [defaultMixerItem, setDefaultMixerItem] = useAtom(defaultMixerItemAtom);
  const [batchMixerItem, setBatchMixerItem] = useAtom(batchMixerItemAtom);
  const [soloBlockId, setSoloBlockId] = useAtom(soloBlockIdAtom);
  const [mixerItems, setMixerItems] = useAtom(mixerItemsAtom);
  const [blockList, setBlockList] = useAtom(blockListAtom);

  const bandwidth = useMemo(() => {
    const size = mixerItems.reduce(
      (acc, item) => acc + BANDWIDTHS[item.setting.quality],
      0
    );

    if (size > 2000) {
      const value = Math.round((size / 1024) * 10) / 10;
      return `${value}MB/s`;
    } else {
      return `${size}KB/s`;
    }
  }, [mixerItems]);

  async function initializeMixer() {
    const quality = await getStoragePlayerQuality();
    const volume = await getStoragePlayerVolume();
    const muted = await getStoragePlayerMuted();

    setDefaultMixerItem({
      id: null,
      name: "기본값",
      setting: {
        quality,
        volume,
        lock: false,
        muted,
      },
    });

    const items = blockList.map((block) => ({
      id: block.id,
      name: block.channel?.name ?? "채널 없음",
      setting: block.setting,
    }));

    setMixerItems(items);
  }

  function findMixerItem(id: number | null): MixerItem {
    if (id === null) {
      return defaultMixerItem;
    }

    if (id === 0) {
      return batchMixerItem;
    }

    const item = mixerItems.find((item) => item.id === id);

    if (item === undefined) {
      throw new Error(`Mixer item not found: ${id}`);
    }

    return item;
  }

  function getSolo(id: number | null): boolean {
    return id !== null && soloBlockId === id;
  }

  function getVolume(id: number | null): number {
    const item = findMixerItem(id);

    if (soloBlockId !== null && soloBlockId !== id) {
      if (id !== 0 && id !== null) {
        return 0;
      }
    }

    if (item.setting.muted) {
      return 0;
    }

    return item.setting.volume;
  }

  function setQuality(id: number | null, value: number) {
    if (id === 0) {
      setBatchQuality(value);
      return;
    }

    if (id === null) {
      setDefaultQuality(value);
      return;
    }

    setMixerItems((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        throw new Error(`Mixer item not found: ${id}`);
      }

      item.setting.quality = value;
    });
  }

  function setDefaultQuality(value: number) {
    setStoragePlayerQuality(value);

    setDefaultMixerItem((draft) => {
      draft.setting.quality = value;
    });
  }

  function setBatchQuality(value: number) {
    setBatchMixerItem((draft) => {
      draft.setting.quality = value;
    });

    setMixerItems((draft) => {
      draft.forEach((item) => {
        if (item.setting.lock === false) {
          item.setting.quality = value;
        }
      });
    });
  }

  function setVolume(id: number | null, value: number) {
    if (id === 0) {
      setBatchVolume(value);
      return;
    }

    if (id === null) {
      setDefaultVolume(value);
      return;
    }

    setMixerItems((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        throw new Error(`Mixer item not found: ${id}`);
      }

      item.setting.volume = value;
      item.setting.muted = false;

      if (item.id === null || item.id === 0) return;

      const muted =
        item.setting.muted || (soloBlockId !== null && soloBlockId !== item.id);

      updatePlayerControl(item.id, {
        volume: item.setting.volume,
        muted,
      });
    });
  }

  function setDefaultVolume(value: number) {
    setStoragePlayerVolume(value);

    setDefaultMixerItem((draft) => {
      draft.setting.volume = value;
      draft.setting.muted = false;
    });

    setStoragePlayerMuted(false);
  }

  function setBatchVolume(value: number) {
    setBatchMixerItem((draft) => {
      draft.setting.volume = value;
      draft.setting.muted = false;
    });

    setMixerItems((draft) => {
      draft.forEach((item) => {
        if (item.setting.lock) return;

        item.setting.volume = value;
        item.setting.muted = false;

        if (item.id === null || item.id === 0) return;

        const muted =
          item.setting.muted ||
          (soloBlockId !== null && soloBlockId !== item.id);

        updatePlayerControl(item.id, {
          volume: item.setting.volume,
          muted,
        });
      });
    });
  }

  function switchLock(id: number | null) {
    if (id === 0 || id === null) {
      return;
    }

    setMixerItems((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        throw new Error(`Mixer item not found: ${id}`);
      }

      item.setting.lock = !item.setting.lock;
    });
  }

  function switchSolo(id: number | null) {
    if (id === 0 || id === null) {
      return;
    }

    const newValue = soloBlockId === id ? null : id;
    setSoloBlockId(newValue);

    if (newValue !== null) {
      setMixerItems((draft) => {
        const item = draft.find((item) => item.id === id);
        if (item === undefined) return;

        item.setting.muted = false;
      });
    }

    for (const item of mixerItems) {
      if (item.id === null || item.id === 0) continue;

      updatePlayerControl(item.id, {
        muted:
          item.setting.muted || (newValue !== null && newValue !== item.id),
      });
    }
  }

  function switchMute(id: number | null) {
    if (id === null) {
      switchDefaultMute();
      return;
    }

    if (id === 0 || id === null) {
      switchBatchMute();
      return;
    }

    setMixerItems((draft) => {
      const item = draft.find((item) => item.id === id);

      if (item === undefined) {
        throw new Error(`Mixer item not found: ${id}`);
      }

      if (item.setting.volume === 0) {
        item.setting.volume = 1;
        item.setting.muted = false;
      } else {
        item.setting.muted = !item.setting.muted;
      }

      const muted =
        item.setting.muted || (soloBlockId !== null && soloBlockId !== item.id);

      if (item.id === null || item.id === 0) return;
      updatePlayerControl(item.id, {
        volume: item.setting.volume,
        muted,
      });
    });
  }

  function switchDefaultMute() {
    setDefaultMixerItem((draft) => {
      if (draft.setting.volume === 0) {
        draft.setting.volume = 1;
        draft.setting.muted = false;
      } else {
        draft.setting.muted = !draft.setting.muted;
      }

      setStoragePlayerVolume(draft.setting.volume);
      setStoragePlayerMuted(draft.setting.muted);
    });
  }

  function switchBatchMute() {
    let muted = false;
    setBatchMixerItem((draft) => {
      if (draft.setting.volume === 0) {
        draft.setting.volume = 1;
        draft.setting.muted = false;
        muted = draft.setting.muted;
        return;
      }

      draft.setting.muted = !draft.setting.muted;
      muted = draft.setting.muted;
    });

    setMixerItems((draft) => {
      draft.forEach((item) => {
        if (item.setting.lock) return;

        if (item.setting.volume === 0) {
          item.setting.volume = 1;
          item.setting.muted = false;
        } else {
          item.setting.muted = muted;
        }

        if (item.id === null || item.id === 0) return;

        const _muted =
          item.setting.muted ||
          (soloBlockId !== null && soloBlockId !== item.id);

        updatePlayerControl(item.id, {
          volume: item.setting.volume,
          muted: _muted,
        });
      });
    });
  }

  async function updatePlayerControl(
    id: number,
    data: PlayerControlMessageData
  ) {
    try {
      await sendPlayerControl(id, data);
    } catch (e) {
      // ignore
    }
  }

  function saveMixer() {
    setBlockList((draft) => {
      draft.forEach((block) => {
        const item = mixerItems.find((item) => item.id === block.id);

        if (item === undefined) {
          return;
        }

        const muted =
          item.setting.muted ||
          (soloBlockId !== null && soloBlockId !== item.id);

        block.setting = item.setting;
        updatePlayerControl(block.id, {
          volume: item.setting.volume,
          quality: item.setting.quality,
          muted: muted,
        });
      });
    });
  }

  useEffect(() => {
    if (modal.type === ModalType.Mixer) {
      initializeMixer();
    } else {
      saveMixer();
    }
  }, [modal]);

  return {
    defaultMixerItem,
    mixerItems,
    bandwidth,
    initializeMixer,
    findMixerItem,
    getSolo,
    getVolume,
    setQuality,
    setVolume,
    switchLock,
    switchSolo,
    switchMute,
  };
}
