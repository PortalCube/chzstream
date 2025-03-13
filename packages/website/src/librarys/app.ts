import { Block, PreviewBlock } from "@web/librarys/block.ts";
import { LayoutMode } from "@web/librarys/layout.ts";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const favoriteChannelsAtom = atom<string[]>([]);

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

export const blockContextMenuOptionsAtom = atom<{
  id: number;
  x: number;
  y: number;
} | null>(null);
export const blockContextMenuAtom = atom<Block | null>((get) => {
  const options = get(blockContextMenuOptionsAtom);
  if (options === null) return null;

  const id = options.id;
  const find = get(blockListAtom).find((block) => block.id === id);
  if (find === undefined) return null;

  return find;
});

export const clearBlockContextMenuAtom = atom(null, (_get, set) => {
  set(blockContextMenuOptionsAtom, null);
});
