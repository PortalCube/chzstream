import { atomWithListeners } from "@web/hooks/atomWithListeners.tsx";
import { SearchItemType } from "@web/librarys/search.ts";
import { atom } from "jotai";

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
  Argument extends Record<string, unknown> | null = null,
  Callback extends ModalCallback | null = null,
> {
  type: Type;
  argument: Argument;
  callback: Callback;
}

/*===========================*
 * Modal Types
 *===========================*/

// -- None --
export type NoneModalMessage = ModalMessageBase<"none", null, null>;

// Setting
export type SettingModalMessage = ModalMessageBase<"setting", null, null>;

// Search
export type SearchModalMessage = ModalMessageBase<
  "search",
  SearchModalOptions,
  SearchCallbackType
>;

type SearchModalOptions = {
  allowMultiSelect: boolean;
};

type SearchCallbackType = (channels: SearchItemType[]) => void;

// Mixer
export type MixerModalMessage = ModalMessageBase<"mixer", null, null>;

// Preset
export type PresetModalMessage = ModalMessageBase<"preset", null, null>;

export const [modalAtom, useModalListener] = atomWithListeners<ModalMessage>({
  type: "none",
  argument: null,
  callback: null,
});

export const openSettingModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "setting", argument: null, callback: null });
});

export const openSearchModalAtom = atom(
  null,
  (
    _get,
    set,
    callback: SearchCallbackType,
    options: SearchModalOptions = { allowMultiSelect: true }
  ) => {
    set(modalAtom, {
      type: "search",
      argument: options,
      callback,
    });
  }
);

export const openMixerModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "mixer", argument: null, callback: null });
});

export const openPresetModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "preset", argument: null, callback: null });
});

export const closeModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: "none", argument: null, callback: null });
});
