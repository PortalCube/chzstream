import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import {
  Block,
  PreviewBlock,
  PreviewBlockStatus,
} from "@web/librarys/block.ts";
import { LayoutMode } from "@web/librarys/layout.ts";

export const favoriteChannelsAtom = atom<string[]>([]);

export const mouseIsTopAtom = atom<boolean>(false);
export const layoutModeAtom = atom<LayoutMode>(LayoutMode.Modify);
export const layoutSizeAtom = atom<[number, number]>([0, 0]);

export const previewBlockAtom = atomWithImmer<PreviewBlock>({
  status: PreviewBlockStatus.Inactive,
  position: {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  },
  linkedBlockId: null,
  handle: null,
});

const initialBlockList: Block[] = [];
export const blockListAtom = atomWithImmer<Block[]>(initialBlockList);

const initialId = 1;
export const nextBlockIdAtom = atom<number>(initialId);
