import { Block, PreviewBlock } from "@web/librarys/block.ts";
import { LayoutMode } from "@web/librarys/layout.ts";
import { FavoriteChannelItem } from "@web/scripts/storage.ts";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const favoriteChannelsAtom = atom<FavoriteChannelItem[]>([]);

export const mouseIsTopAtom = atom<boolean>(false);
export const layoutModeAtom = atom<LayoutMode>("modify");
export const layoutSizeAtom = atom<[number, number]>([0, 0]);

export const previewBlockAtom = atomWithImmer<PreviewBlock>({
  status: "inactive",
  position: null,
  linkedBlockId: null,
  handle: null,
});

const initialBlockList: Block[] = [];
export const blockListAtom = atomWithImmer<Block[]>(initialBlockList);

const initialId = 1;
export const nextBlockIdAtom = atom<number>(initialId);
