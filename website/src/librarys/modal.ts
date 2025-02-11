import { atom } from "jotai";
import { atomWithListeners } from "src/hooks/atomWithListeners.tsx";
import { SearchItemType } from "./search.ts";

export enum ModalType {
  None = "none",
  Setting = "setting",
  Search = "search",
  Mixer = "mixer",
}

export enum ModalEventType {
  Open = "open",
  Close = "close",
}

/*===========================*
 * Modal Base
 *===========================*/

type ModalCallback = SearchCallbackType;
type ModalMessage =
  | NoneModalMessage
  | SettingModalMessage
  | SearchModalMessage
  | MixerModalMessage;

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
export type NoneModalMessage = ModalMessageBase<ModalType.None>;

// Setting
export type SettingModalMessage = ModalMessageBase<ModalType.Setting>;

// Search
export type SearchModalMessage = ModalMessageBase<
  ModalType.Search,
  undefined,
  SearchCallbackType
>;

type SearchCallbackType = (channel: SearchItemType) => void;

// Mixer
export type MixerModalMessage = ModalMessageBase<ModalType.Mixer>;

export const [modalAtom, useModalListener] = atomWithListeners<ModalMessage>({
  type: ModalType.None,
});

export const openSettingModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: ModalType.Setting });
});

export const openSearchModalAtom = atom(
  null,
  (_get, set, callback: SearchCallbackType) => {
    set(modalAtom, { type: ModalType.Search, callback });
  }
);

export const openMixerModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: ModalType.Mixer });
});

export const closeModalAtom = atom(null, (_get, set) => {
  set(modalAtom, { type: ModalType.None });
});
