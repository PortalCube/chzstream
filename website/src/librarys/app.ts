import { atom } from "jotai";

export const favoriteChannelsAtom = atom<string[]>([]);
export const restrictedModeAtom = atom<boolean>(false);
