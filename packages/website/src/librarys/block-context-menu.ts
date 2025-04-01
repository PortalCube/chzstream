import { blockListAtom } from "@web/librarys/app.ts";
import { Block } from "@web/librarys/block.ts";
import { atom } from "jotai";

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
