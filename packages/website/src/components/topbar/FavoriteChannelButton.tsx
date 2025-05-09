import React from "react";
import { IconType } from "react-icons";
import styled from "styled-components";

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

function FavoriteChannelButton({
  icon,
  onClick,
  gap,
}: FavoriteChannelButtonProps) {
  const Icon = icon;
  return (
    <Container onClick={onClick} $gap={gap}>
      <Icon size={24} />
    </Container>
  );
}

type FavoriteChannelButtonProps = {
  icon: IconType;
  onClick: React.MouseEventHandler;
  gap: number;
};

export default FavoriteChannelButton;
