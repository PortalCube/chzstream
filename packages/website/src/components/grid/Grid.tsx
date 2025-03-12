import Block from "@web/components/block/Block.tsx";
import BlockPreview from "@web/components/grid/BlockPreview.tsx";
import GridBackground from "@web/components/grid/GridBackground.tsx";
import {
  blockListAtom,
  layoutModeAtom,
  layoutSizeAtom,
  previewBlockAtom,
} from "@web/librarys/app.ts";
import { PreviewBlockStatus } from "@web/librarys/block.ts";
import {
  beginPreviewAtom,
  endPreviewAtom,
  moveModifyPreviewAtom,
  movePreviewAtom,
} from "@web/librarys/layout-preview.ts";
import {
  LayoutMode,
  modifyBlockAtom,
  pushBlockAtom,
} from "@web/librarys/layout.ts";
import {
  GRID_SIZE_HEIGHT,
  GRID_SIZE_WIDTH,
  MIN_BLOCK_HEIGHT,
  MIN_BLOCK_WIDTH,
} from "@web/scripts/constants.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  flex-grow: 1;

  background-color: #1f1f1f;

  position: relative;
  transition: background-color 200ms;

  overflow: hidden;

  &.view-mode {
    background-color: #000000;
  }
`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getGridPosition(
  element: HTMLElement | null,
  mouseX: number,
  mouseY: number
) {
  if (element === null) {
    return [0, 0];
  }

  const {
    x: elementX,
    y: elementY,
    width,
    height,
  } = element.getBoundingClientRect();

  const x = mouseX - elementX;
  const y = mouseY - elementY;

  const gridWidth = width / GRID_SIZE_WIDTH;
  const gridHeight = height / GRID_SIZE_HEIGHT;

  const gridX = clamp(Math.floor(x / gridWidth), 0, GRID_SIZE_WIDTH - 1);
  const gridY = clamp(Math.floor(y / gridHeight), 0, GRID_SIZE_HEIGHT - 1);

  return [gridX, gridY];
}

function Grid() {
  const ref = useRef<HTMLDivElement>(null);
  const previewBlock = useAtomValue(previewBlockAtom);
  const setLayoutSize = useSetAtom(layoutSizeAtom);
  const blockList = useAtomValue(blockListAtom);
  const layoutMode = useAtomValue(layoutModeAtom);
  const pushBlock = useSetAtom(pushBlockAtom);
  const modifyBlock = useSetAtom(modifyBlockAtom);

  const beginPreview = useSetAtom(beginPreviewAtom);
  const movePreview = useSetAtom(movePreviewAtom);
  const endPreview = useSetAtom(endPreviewAtom);

  const moveModifyBlockPreview = useSetAtom(moveModifyPreviewAtom);

  const className = classNames({
    "view-mode": layoutMode === LayoutMode.View,
  });

  const blockElements: React.ReactNode[] = blockList.map((block) => (
    <Block key={block.id} block={block} />
  ));

  const onPointerDown: React.PointerEventHandler = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.button !== 0) return;
    if (layoutMode !== LayoutMode.Modify) return;
    if (ref.current == null) return;

    const { clientX, clientY } = event;
    const [x, y] = getGridPosition(ref.current, clientX, clientY);

    beginPreview(x, y);
  };

  useEffect(() => {
    if (ref && ref.current) {
      const { clientWidth, clientHeight } = ref.current;
      setLayoutSize([clientWidth, clientHeight]);

      const onResize = () => {
        if (ref.current === null) return;
        const { clientWidth, clientHeight } = ref.current;

        setLayoutSize([clientWidth, clientHeight]);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (previewBlock.status === PreviewBlockStatus.Inactive) return;
        if (previewBlock.position === null) return;

        const { clientX, clientY } = event;
        const [x, y] = getGridPosition(ref.current, clientX, clientY);

        if (previewBlock.status === PreviewBlockStatus.Create) {
          movePreview(x, y);
        } else if (
          previewBlock.status === PreviewBlockStatus.Modify &&
          previewBlock.linkedBlockId !== null
        ) {
          moveModifyBlockPreview(x, y);
          modifyBlock({
            id: previewBlock.linkedBlockId,
            position: previewBlock.position,
          });
        }
      };

      const onPointerUp = (event: PointerEvent) => {
        if (event.button !== 0) return;
        if (previewBlock.status === PreviewBlockStatus.Inactive) return;

        if (previewBlock.status === PreviewBlockStatus.Modify) {
          endPreview();
          return;
        }

        if (previewBlock.position === null) {
          endPreview();
          return;
        }

        let top = previewBlock.position.top;
        let left = previewBlock.position.left;
        let width = previewBlock.position.width;
        let height = previewBlock.position.height;

        if (width <= 0) {
          left = left + width - 1;
          width = 2 - width;
        }

        if (height <= 0) {
          top = top + height - 1;
          height = 2 - height;
        }

        endPreview();

        if (width < MIN_BLOCK_WIDTH || height < MIN_BLOCK_HEIGHT) {
          return;
        }

        pushBlock({ top, left, width, height });
      };

      window.addEventListener("resize", onResize);
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);

      return () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };
    }
  }, [ref, previewBlock, blockList]);

  return (
    <Container ref={ref} className={className} onPointerDown={onPointerDown}>
      <GridBackground />
      {blockElements}
      <BlockPreview />
    </Container>
  );
}

export default Grid;
