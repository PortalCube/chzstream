import { IconType } from "react-icons";
import { Mixin } from "@web/scripts/styled.ts";
import styled, { css } from "styled-components";

const Container = styled.button`
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

  ${Mixin.screen.greater.large(css`
    padding: 4px 8px;
    border-radius: 4px;
  `)}

  ${Mixin.screen.less.large(css`
    padding: 6px;
    border-radius: 50%;
  `)}

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  & > svg {
    color: rgba(255, 255, 255, 1);

    ${Mixin.screen.greater.large(css`
      width: 28px;
      height: 28px;
    `)}

    ${Mixin.screen.less.large(css`
      width: 20px;
      height: 20px;
    `)}
  }
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;

  ${Mixin.screen.less.extraLarge(css`
    display: none;
  `)}
`;

function MenuButton({ Icon, text, onClick = () => {} }: MenuButtonProps) {
  return (
    <Container onClick={onClick}>
      <Icon />
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
