import { atom } from "jotai";
import { atomWithListeners } from "@web/hooks/atomWithListeners.tsx";
import { SearchItemType } from "@web/librarys/search.ts";

export type ModalType = "none" | "setting" | "search" | "mixer" | "preset";

/*===========================*
 * Modal Base
 *===========================*/

type ModalCallback = SearchCallbackType;
type ModalMessage =
  | NoneModalMessage
  | SettingModalMessage
  | SearchModalMessage
  | MixerModalMessage
  | PresetModalMessage;

export interface ModalMessageBase<
  Type extends ModalType,
  Argument extends Record<string, unknown> | undefined = undefined,
  Callback extends ModalCallback | undefined = undefined,
> {
  type: Type;
  argument?: Argument;
  callback?: Callback;
}

/*===========================*
 * Modal Types
 *===========================*/

// -- None --
export type NoneModalMessage = ModalMessageBase<"none">;

// Setting
export type SettingModalMessage = ModalMessageBase<"setting">;

// Search
export type SearchModalMessage = ModalMessageBase<
  "search",
  undefined,
  SearchCallbackType
>;

type SearchCallbackType = (channel: SearchItemType) => void;

// Mixer
export type MixerModalMessage = ModalMessageBase<"mixer">;

// Mixer
export type PresetModalMessage = ModalMessageBase<"preset">;

export const [modalAtom, useModalListener] = atomWithListeners<ModalMessage>({
  type: "none",
});

export const openSettingModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "setting" });
});

export const openSearchModalAtom = atom(
  null,
  (_get, set, callback: SearchCallbackType) => {
    set(modalAtom, { type: "search", callback });
  }
);

export const openMixerModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "mixer" });
});

export const closeModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "none" });
});
