import classNames from "classnames";
import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { PreviewBlockStatus } from "src/librarys/block.ts";
import {
  endCreateBlockPreview,
  moveCreateBlockPreview,
  moveModifyBlockPreview,
  previewBlockAtom,
  startCreateBlockPreview,
} from "src/librarys/grid-preview.ts";
import {
  addBlock,
  ApplicationMode,
  applicationModeAtom,
  blockListAtom,
  gridSizeAtom,
  nextBlockIdAtom,
  setBlockPosition,
} from "src/librarys/grid.ts";
import {
  GRID_SIZE_HEIGHT,
  GRID_SIZE_WIDTH,
  MIN_BLOCK_HEIGHT,
  MIN_BLOCK_WIDTH,
} from "src/scripts/constants.ts";
import Block from "src/components/block/Block.tsx";
import BlockPreview from "./BlockPreview.tsx";
import GridBackground from "./GridBackground.tsx";

const Container = styled.div`
  width: 100%;
  flex-grow: 1;

  background-color: #1f1f1f;

  display: grid;
  grid-template-columns: repeat(${GRID_SIZE_WIDTH}, 1fr);
  grid-template-rows: repeat(${GRID_SIZE_HEIGHT}, 1fr);

  transition: background 200ms;

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
  const [mode, setMode] = useAtom(applicationModeAtom);
  const [blockList, setBlockList] = useAtom(blockListAtom);
  const [previewBlock, setPreviewBlock] = useAtom(previewBlockAtom);
  const [id, setId] = useAtom(nextBlockIdAtom);
  const [gridSize, setGridSize] = useAtom(gridSizeAtom);

  const className = classNames({
    "view-mode": mode === ApplicationMode.View,
  });

  const blockElements: JSX.Element[] = blockList.map((block) => (
    <Block key={block.id} id={block.id} />
  ));

  const onPointerDown: React.PointerEventHandler = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.button !== 0) return;
    if (mode !== ApplicationMode.Modify) return;
    if (ref.current == null) return;

    const { clientX, clientY } = event;
    const [x, y] = getGridPosition(ref.current, clientX, clientY);

    setPreviewBlock(startCreateBlockPreview(x, y, blockList));
  };

  useEffect(() => {
    if (ref && ref.current) {
      const { clientWidth, clientHeight } = ref.current;
      setGridSize([clientWidth, clientHeight]);

      const onResize = () => {
        if (ref.current === null) return;
        const { clientWidth, clientHeight } = ref.current;

        setGridSize([clientWidth, clientHeight]);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (previewBlock.status === PreviewBlockStatus.Inactive) return;

        const { clientX, clientY } = event;
        const [x, y] = getGridPosition(ref.current, clientX, clientY);

        if (previewBlock.status === PreviewBlockStatus.Create) {
          setPreviewBlock(moveCreateBlockPreview(x, y, blockList));
        } else if (previewBlock.status === PreviewBlockStatus.Modify) {
          setPreviewBlock(
            moveModifyBlockPreview(x, y, previewBlock.linkedBlockId, blockList)
          );
          setBlockList(
            setBlockPosition(previewBlock.linkedBlockId, previewBlock.position)
          );
        }
      };

      const onPointerUp = (event: PointerEvent) => {
        if (event.button !== 0) return;
        if (previewBlock.status === PreviewBlockStatus.Inactive) return;

        if (previewBlock.status === PreviewBlockStatus.Modify) {
          setPreviewBlock(endCreateBlockPreview());
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

        setPreviewBlock(endCreateBlockPreview());

        if (width < MIN_BLOCK_WIDTH || height < MIN_BLOCK_HEIGHT) {
          return;
        }

        setBlockList(addBlock(id, top, left, width, height));
        setId((prev) => prev + 1);
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
  }, [
    ref,
    previewBlock,
    setBlockList,
    setPreviewBlock,
    blockList,
    id,
    setId,
    setGridSize,
  ]);

  return (
    <Container ref={ref} className={className} onPointerDown={onPointerDown}>
      <GridBackground />
      {blockElements}
      <BlockPreview />
    </Container>
  );
}

export default Grid;
