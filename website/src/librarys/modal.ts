import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { BlockChannel } from "./block.ts";
import { SearchItemType } from "./search-modal.ts";

export enum ModalType {
  None = "none",
  Setting = "setting",
  Search = "search",
}

export enum ModalEventType {
  Open = "open",
  Close = "close",
}

export interface ModalMessageBase<
  Type extends ModalType,
  Argument extends Record<string, unknown> | undefined = undefined,
  Callback extends ModalCallback | undefined = undefined,
> {
  type: Type;
  argument?: Argument;
  callback?: Callback;
}

export type NoneModalMessage = ModalMessageBase<ModalType.None>;

export type SettingModalMessage = ModalMessageBase<ModalType.Setting>;

type SearchCallbackType = (channel: SearchItemType) => void;
export type SearchModalMessage = ModalMessageBase<
  ModalType.Search,
  undefined,
  SearchCallbackType
>;

type ModalCallback = SearchCallbackType;
type ModalMessage = NoneModalMessage | SettingModalMessage | SearchModalMessage;

export const modalAtom = atom<ModalMessage>({
  type: ModalType.None,
});

function getEventName(type: ModalType, event: ModalEventType) {
  return [type, event].join("-");
}

const emitter = new EventTarget();

export function useModal() {
  const ref = useRef<EventTarget>(emitter);
  const [modal, setModal] = useAtom(modalAtom);

  function openSettingModal() {
    setModal({ type: ModalType.Setting });
    dispatch(ModalType.Setting, ModalEventType.Open);
  }

  function openSearchModal(callback: SearchCallbackType) {
    setModal({ type: ModalType.Search, callback });
    dispatch(ModalType.Search, ModalEventType.Open);
  }

  function closeModal() {
    if (modal.type !== ModalType.None) {
      dispatch(modal.type, ModalEventType.Close);
    }
    setModal({ type: ModalType.None });
  }

  function addModalListener(
    type: ModalType,
    event: ModalEventType,
    callback: () => void
  ) {
    const eventName = getEventName(type, event);
    ref.current.removeEventListener(eventName, callback);
    ref.current.addEventListener(eventName, callback);
  }

  function removeModalListener(
    type: ModalType,
    event: ModalEventType,
    callback: () => void
  ) {
    const eventName = getEventName(type, event);
    ref.current.removeEventListener(eventName, callback);
  }

  function dispatch(type: ModalType, event: ModalEventType) {
    const eventName = getEventName(type, event);
    ref.current.dispatchEvent(new CustomEvent(eventName));
  }

  return {
    modal,
    openSettingModal,
    openSearchModal,
    closeModal,
    addModalListener,
    removeModalListener,
  };
}
