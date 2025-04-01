import { layoutModeAtom } from "@web/librarys/app.ts";
import { BlockContext } from "@web/librarys/context.ts";
import { dragStatusAtom, useBlockDrop } from "@web/librarys/drag-and-drop.ts";
import { Mixin } from "@web/scripts/styled.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useContext, useRef, useState } from "react";
import { MdAdd, MdSwapHoriz } from "react-icons/md";
import styled, { css } from "styled-components";

const Container = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &.modify-mode {
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border-radius: 8px;
  }

  overflow: hidden;

  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 24px;

  ${Mixin.block.less.large(css`
    gap: 16px;
  `)}

  opacity: 0;
  transition-property: opacity;
  transition-duration: 50ms;

  background-color: rgba(0, 0, 0, 0.6);

  &.disable {
    pointer-events: none;
  }

  &.show {
    opacity: 1;
  }
`;

const Item = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 36px;

  ${Mixin.block.less.large(css`
    width: 80px;
    height: 80px;
    border-radius: 24px;
  `)}

  background-color: rgba(0, 0, 0, 0.75);
  box-shadow: inset 0 0 36px rgba(77, 77, 77, 0.33);
  backdrop-filter: blur(8px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 64px;
    height: 64px;

    ${Mixin.block.less.large(css`
      width: 40px;
      height: 40px;
    `)}
  }

  & > * {
    pointer-events: none;
  }

  transition-property: background-color, box-shadow;
  transition-duration: 50ms;

  &.hover {
    background-color: rgba(0, 12, 24, 0.8);
    box-shadow: inset 0 0 20px rgba(5, 171, 216, 0.5);
  }

  &.hidden {
    display: none;
  }
`;

const ItemText = styled.div`
  color: rgb(181, 181, 181);
  font-size: 16px;
  font-weight: 500;

  ${Mixin.block.less.large(css`
    display: none;
  `)}
`;

function DragOverlay({}: LoadingOverlayProps) {
  const block = useContext(BlockContext);
  const ref = useRef<HTMLDivElement>(null);
  const layoutMode = useAtomValue(layoutModeAtom);
  const dragStatus = useAtomValue(dragStatusAtom);
  const { onDrop } = useBlockDrop(block);

  const [active, setActive] = useState<boolean>(false);
  const [selection, setSelection] = useState<number>(0);

  const onContainerDragEnter: React.DragEventHandler = () => {
    setActive(true);
  };

  const onContainerDragOver: React.DragEventHandler = () => {
    setActive(true);
  };

  const onContainerDragLeave: React.DragEventHandler = () => {
    setActive(false);
  };

  const onItemDragEnter = (id: number): React.DragEventHandler => {
    return (event) => {
      setActive(true);
      setSelection(id);
    };
  };

  const onItemDragOver: React.DragEventHandler = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActive(true);
  };

  const onItemDragLeave: React.DragEventHandler = () => {
    setSelection(0);
    setActive(true);
  };

  const onItemDrop = (mode: "swap" | "copy"): React.DragEventHandler => {
    return (event) => {
      event.preventDefault();
      setActive(false);
      setSelection(0);
      onDrop(mode, event);
    };
  };

  return (
    <Container
      ref={ref}
      onDragEnter={onContainerDragEnter}
      onDragOver={onContainerDragOver}
      onDragLeave={onContainerDragLeave}
      className={classNames({
        "modify-mode": layoutMode === "modify",
        disable: block.status.droppable === false,
        show: active || selection !== 0,
      })}
    >
      <Item
        onDragEnter={onItemDragEnter(1)}
        onDragOver={onItemDragOver}
        onDragLeave={onItemDragLeave}
        onDrop={onItemDrop("copy")}
        className={classNames({ hover: selection === 1 })}
      >
        <MdAdd />
        <ItemText>채널 복사</ItemText>
      </Item>
      <Item
        onDragEnter={onItemDragEnter(2)}
        onDragOver={onItemDragOver}
        onDragLeave={onItemDragLeave}
        onDrop={onItemDrop("swap")}
        className={classNames({
          hidden: dragStatus !== "block",
          hover: selection === 2,
        })}
      >
        <MdSwapHoriz />
        <ItemText>블록 이동</ItemText>
      </Item>
    </Container>
  );
}

type LoadingOverlayProps = {};

export default DragOverlay;
