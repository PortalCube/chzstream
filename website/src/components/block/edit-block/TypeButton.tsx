import { useAtom } from "jotai";
import React from "react";
import { MdHelp } from "react-icons/md";
import styled, { css } from "styled-components";
import {
  BlockType,
  getBlockTypeIcon,
  getBlockTypeName,
} from "src/librarys/block.ts";
import { blockListAtom, setBlockType } from "src/librarys/grid.ts";
import {
  extraLargeBlockMixin,
  extraSmallBlockMixin,
  largeBlockMixin,
  mediumBlockMixin,
  smallBlockMixin,
} from "src/scripts/styled.ts";

const Container = styled.button`
  border: none;
  border-radius: 4px;

  display: flex;
  align-items: center;
  gap: 8px;

  transition: padding 100ms;

  ${extraLargeBlockMixin(css`
    padding: 4px 8px;
  `)}

  ${largeBlockMixin(css`
    padding: 4px 8px;
  `)}

  ${mediumBlockMixin(css`
    padding: 4px 8px;
  `)}

  ${smallBlockMixin(css`
    padding: 4px 8px;
  `)}

  ${extraSmallBlockMixin(css`
    padding: 4px;
  `)}

  color: rgba(0, 0, 0, 1);
  cursor: pointer;

  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  background-color: rgb(0, 255, 163);

  transition: background-color 100ms;
  &:hover {
    background-color: rgb(71, 255, 188);
  }

  & > svg {
    transition:
      width 100ms,
      height 100ms;

    ${extraLargeBlockMixin(css`
      width: 24px;
      height: 24px;
    `)}

    ${largeBlockMixin(css`
      width: 24px;
      height: 24px;
    `)}

    ${mediumBlockMixin(css`
      width: 20px;
      height: 20px;
    `)}

    ${smallBlockMixin(css`
      width: 20px;
      height: 20px;
    `)}

    ${extraSmallBlockMixin(css`
      width: 16px;
      height: 16px;
    `)}
  }
`;

const Text = styled.p`
  font-weight: 600;

  transition: font-size 100ms;

  ${extraLargeBlockMixin(css`
    font-size: 16px;
  `)}

  ${largeBlockMixin(css`
    font-size: 16px;
  `)}

  ${mediumBlockMixin(css`
    font-size: 13px;
  `)}

  ${smallBlockMixin(css`
    font-size: 13px;
  `)}

  ${extraSmallBlockMixin(css`
    font-size: 12px;
    display: none;
  `)}
`;

function TypeButton({ id, type }: BlockTypeButtonProps) {
  const [_, setBlockList] = useAtom(blockListAtom);

  const TypeIcon = type !== null ? getBlockTypeIcon(type) : MdHelp;
  const typeName = type !== null ? getBlockTypeName(type) : "";

  const onButtonClick: React.MouseEventHandler = () => {
    switch (type) {
      case BlockType.Stream:
        setBlockList(setBlockType(id, BlockType.Chat));
        break;
      case BlockType.Chat:
        setBlockList(setBlockType(id, BlockType.Stream));
        break;
      default:
        break;
    }
  };

  return (
    <Container onClick={onButtonClick}>
      <TypeIcon />
      <Text>{typeName} 블록</Text>
    </Container>
  );
}

type BlockTypeButtonProps = {
  id: number;
  type: BlockType | null;
};

export default TypeButton;
