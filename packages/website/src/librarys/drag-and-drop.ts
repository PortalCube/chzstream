import { DragItem, useDragItem } from "@web/hooks/useDragItem.tsx";
import { clearBlockContextMenuAtom } from "@web/librarys/block-context-menu.ts";
import { Block, BlockChannel } from "@web/librarys/block.ts";
import {
  fetchChzzkChannelAtom,
  lockBlockAtom,
  modifyBlockAtom,
  setBlockChannelAtom,
  swapBlockAtom,
} from "@web/librarys/layout.ts";
import { atom, useSetAtom } from "jotai";
import { useCallback } from "react";

export const dragStatusAtom = atom<"none" | "channel" | "block">("none");

function isDragItem(value: Record<string, unknown>): value is DragItem {
  return value._isChzstreamDragItem === true;
}

function getDragItem(event: React.DragEvent): DragItem | null {
  const rawText = event.dataTransfer.getData("application/json");
  console.log("getDragItem", rawText);
  const rawJson = JSON.parse(rawText);

  if (isDragItem(rawJson)) return rawJson;
  return null;
}

const setDragItemAtom = atom(
  null,
  (_get, set, event: React.DragEvent, dragItem: DragItem) => {
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.dropEffect = "move";

    const data = JSON.stringify(dragItem);
    console.log("setDragItem", data);
    event.dataTransfer.setData("application/json", data);

    requestAnimationFrame(() => {
      set(lockBlockAtom);
      set(clearBlockContextMenuAtom);
    });
  }
);

export function useBlockDrag(block: Block | null) {
  const { id, channel } = block ?? { id: null, channel: null };
  const [dragElement, dragItem, dragRef] = useDragItem(id, channel);
  const setDragStatus = useSetAtom(dragStatusAtom);
  const setDragItem = useSetAtom(setDragItemAtom);

  const onDragStart: React.DragEventHandler = useCallback(
    (event) => {
      // DnD API 미지원
      if (event.dataTransfer === null) return false;

      // 채널이 없는 블록
      if (channel === null) return false;

      // DnD 이미지 지정
      if (dragRef !== null) {
        event.dataTransfer.setDragImage(dragRef, 0, 0);
      }

      setDragItem(event, dragItem);
      setDragStatus("block");
    },
    [channel, block, dragItem, dragRef]
  );

  const onDragEnd: React.DragEventHandler = () => setDragStatus("none");

  return {
    dragElement,
    onDragStart,
    onDragEnd,
  };
}

export function useChannelDrag(channel: BlockChannel | null) {
  const [dragElement, dragItem, dragRef] = useDragItem(null, channel);
  const setDragStatus = useSetAtom(dragStatusAtom);
  const setDragItem = useSetAtom(setDragItemAtom);

  const onDragStart: React.DragEventHandler = useCallback(
    (event) => {
      // DnD API 미지원
      if (event.dataTransfer === null) return false;

      // DnD 이미지 지정
      if (dragRef !== null) {
        event.dataTransfer.setDragImage(dragRef, 0, 0);
      }

      setDragItem(event, dragItem);
      setDragStatus("channel");
    },
    [dragItem, dragRef]
  );

  const onDragEnd: React.DragEventHandler = () => setDragStatus("none");

  return {
    dragElement,
    onDragStart,
    onDragEnd,
  };
}

const swapDragBlockAtom = atom(
  null,
  async (_get, set, block: Block, dragItem: DragItem) => {
    if (dragItem.block === null) return;
    set(swapBlockAtom, block.id, dragItem.block);
  }
);

const copyDragBlockAtom = atom(
  null,
  async (_get, set, block: Block, dragItem: DragItem) => {
    const channel = await set(fetchChzzkChannelAtom, dragItem.channelId);
    set(setBlockChannelAtom, block.id, channel);
  }
);

export function useBlockDrop(block: Block) {
  const swapDragBlock = useSetAtom(swapDragBlockAtom);
  const copyDragBlock = useSetAtom(copyDragBlockAtom);

  const onDrop = useCallback(
    (mode: "swap" | "copy", event: React.DragEvent) => {
      // DnD API 미지원
      if (event.dataTransfer === null) return;

      event.preventDefault();

      // dataTransfer에서 DragItem 가져오기
      const dragItem = getDragItem(event);
      if (dragItem === null) return;

      if (mode === "swap") {
        swapDragBlock(block, dragItem);
      } else if (mode === "copy") {
        copyDragBlock(block, dragItem);
      }
    },
    [block]
  );

  return {
    onDrop,
  };
}
