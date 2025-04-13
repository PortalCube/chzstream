import Background from "@web/components/block/edit-block/Background.tsx";
import Channel from "@web/components/block/edit-block/Channel.tsx";
import TypeButton from "@web/components/block/edit-block/TypeButton.tsx";
import Handle from "@web/components/block/edit-block/handle/Handle.tsx";
import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { layoutModeAtom } from "@web/librarys/app.ts";
import { blockContextMenuOptionsAtom } from "@web/librarys/block-context-menu.ts";
import { BlockContext } from "@web/librarys/context.ts";
import { removeBlockAtom } from "@web/librarys/layout.ts";
import { Mixin } from "@web/scripts/styled.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useRef } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import styled, { css } from "styled-components";

const Container = styled.div<{ $dpr: number }>`
  --block-margin-base: 4px;
  border-radius: 8px;
  padding: 16px;

  ${Mixin.block.greater.large(css`
    --block-margin: calc(16px + var(--block-margin-base));
  `)}

  ${Mixin.block.less.large(css`
    --block-margin: calc(12px + var(--block-margin-base));
  `)}

  text-align: center;
  color: #ffffff;

  flex-flow: wrap;

  overflow: hidden;
  box-sizing: border-box;

  &.selected {
    opacity: 0.33;
  }

  &.view-mode {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  position: absolute;

  transition:
    top 100ms,
    left 100ms,
    right 100ms;

  top: var(--block-margin);
  left: var(--block-margin);
  right: var(--block-margin);

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
`;

const IconButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  align-items: center;
`;

const IconButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: rgba(255, 255, 255, 1);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);

  transition: background-color 100ms;

  & > svg {
    transition:
      width 100ms,
      height 100ms;

    ${Mixin.block.greater.large(css`
      width: 24px;
      height: 24px;
    `)}

    ${Mixin.block.less.large(css`
      width: 20px;
      height: 20px;
    `)}

  ${Mixin.block.less.small(css`
      width: 16px;
      height: 16px;
    `)}
  }
`;

const RemoveButton = styled(IconButton)`
  background-color: rgb(207, 58, 61);

  &:hover {
    background-color: rgb(234, 72, 75);
  }
`;

const MenuButton = styled(IconButton)`
  background-color: rgb(34, 34, 34);

  &:hover {
    background-color: rgb(48, 48, 48);
  }
`;

function EditBlock({}: EditBlockProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const { id } = useContext(BlockContext);
  const layoutMode = useAtomValue(layoutModeAtom);
  const removeBlock = useSetAtom(removeBlockAtom);
  const setBlockContextMenuOptions = useSetAtom(blockContextMenuOptionsAtom);

  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);

  const className = classNames({ "view-mode": layoutMode === "view" });

  const onRemoveClick = () => {
    removeBlock(id);
  };

  const onMenuClick = () => {
    if (ref.current === null) return;

    const { left, bottom } = ref.current.getBoundingClientRect();

    setBlockContextMenuOptions({
      id,
      x: left,
      y: bottom + 8,
      contextMenu: false,
    });
  };

  return (
    <Container className={className} $dpr={displayPixelRatio}>
      <Background />
      <Handle />
      <ButtonGroup>
        <TypeButton />
        <IconButtonGroup>
          <MenuButton onClick={onMenuClick} ref={ref}>
            <MdMenu />
          </MenuButton>
          <RemoveButton onClick={onRemoveClick}>
            <MdClose />
          </RemoveButton>
        </IconButtonGroup>
      </ButtonGroup>
      <Channel />
    </Container>
  );
}
type EditBlockProps = {};

export default EditBlock;
