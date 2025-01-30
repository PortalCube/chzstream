import { IconType } from "react-icons";
import { largeScreenMixin } from "src/scripts/styled.ts";
import styled, { css } from "styled-components";

const Container = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  gap: 8px;

  align-items: center;

  background: none;
  border: none;
  color: #d0d0d0;

  cursor: pointer;

  user-select: none;
  -webkit-user-select: none;

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;

  ${largeScreenMixin(css`
    display: none;
  `)}
`;

function MenuButton({ Icon, text, onClick = () => {} }: MenuButtonProps) {
  return (
    <Container onClick={onClick}>
      <Icon size={28} color="#ffffff" />
      <Text>{text}</Text>
    </Container>
  );
}

type MenuButtonProps = {
  Icon: IconType;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default MenuButton;
