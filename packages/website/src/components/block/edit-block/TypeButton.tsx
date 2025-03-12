import { useSetAtom } from "jotai";
import React, { useContext } from "react";
import { MdHelp } from "react-icons/md";
import {
  BlockType,
  getBlockTypeIcon,
  getBlockTypeName,
} from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context";
import { modifyBlockAtom } from "@web/librarys/layout.ts";
import { Mixin } from "@web/scripts/styled.ts";
import styled, { css } from "styled-components";

const Container = styled.button`
  border: none;
  border-radius: 4px;

  display: flex;
  align-items: center;
  gap: 8px;

  transition: padding 100ms;

  ${Mixin.block.greater.small(css`
    padding: 4px 8px;
  `)}

  ${Mixin.block.less.small(css`
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

const Text = styled.p`
  font-weight: 600;

  transition: font-size 100ms;

  ${Mixin.block.greater.large(css`
    font-size: 16px;
  `)}

  ${Mixin.block.less.large(css`
    font-size: 13px;
  `)}

  ${Mixin.block.less.small(css`
    font-size: 12px;
    display: none;
  `)}
`;

function TypeButton({}: BlockTypeButtonProps) {
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const { id, type } = useContext(BlockContext);

  const TypeIcon = type !== null ? getBlockTypeIcon(type) : MdHelp;
  const typeName = type !== null ? getBlockTypeName(type) : "";

  const onButtonClick: React.MouseEventHandler = () => {
    switch (type) {
      case "stream":
        modifyBlock({ id, type: "chat" });
        break;
      case "chat":
        modifyBlock({ id, type: "stream" });
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

type BlockTypeButtonProps = {};

export default TypeButton;
