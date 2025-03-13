import React from "react";
import { IconType } from "react-icons";
import styled from "styled-components";

const Container = styled.button`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;

  display: flex;
  gap: 8px;

  cursor: pointer;

  background: none;
  color: rgb(224, 224, 224);

  transition-property: background-color;
  transition-duration: 100ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
`;

function ButtonMenuItem({ icon: Icon, title, onClick }: ButtonMenuItemProps) {
  return (
    <Container onClick={onClick}>
      <Icon size={20} />
      <Text>{title}</Text>
    </Container>
  );
}

type ButtonMenuItemProps = {
  icon: IconType;
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default ButtonMenuItem;
