import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { requestChzzkChannelInfo } from "src/scripts/message.ts";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import { IconType } from "react-icons";

const Container = styled.div<{ $gap: number }>`
  width: 42px;
  height: 42px;

  margin-right: ${({ $gap }) => $gap}px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #1f1f1f;

  box-sizing: border-box;

  overflow: hidden;

  z-index: 999;

  transition:
    transform 100ms,
    background-color 100ms,
    box-shadow 100ms;

  cursor: pointer;

  &:hover {
    transform: scale(1.25);
    background-color: #2a2a2a;
    box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.05);
    z-index: 1000;
  }
`;

function ChannelButton({ icon, onClick, gap }: ChannelButtonProps) {
  const Icon = icon;
  return (
    <Container onClick={onClick} $gap={gap}>
      <Icon size={24} />
    </Container>
  );
}

type ChannelButtonProps = {
  icon: IconType;
  onClick: React.MouseEventHandler;
  gap: number;
};

export default ChannelButton;
