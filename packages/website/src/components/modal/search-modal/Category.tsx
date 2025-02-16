import classNames from "classnames";
import styled from "styled-components";

const Container = styled.button`
  padding: 6px 24px;
  border: none;
  border-radius: 16px;

  box-sizing: border-box;

  font-size: 16px;
  font-weight: 600;

  color: rgba(255, 255, 255, 1);
  background-color: rgba(63, 63, 63, 1);

  transition: background-color 100ms;

  &.active {
    color: rgba(63, 63, 63, 1);
    background-color: rgba(255, 255, 255, 1);
  }

  &.interactable {
    cursor: pointer;
  }

  &.hidden {
    display: none;
  }
`;

function Category({
  name,
  active = false,
  interactable = true,
  hidden = false,
  onClick,
}: CategoryProps) {
  const className = classNames({
    active,
    interactable,
    hidden,
  });

  return (
    <Container className={className} onClick={onClick}>
      {name}
    </Container>
  );
}

type CategoryProps = {
  name: string;
  active?: boolean;
  interactable?: boolean;
  hidden?: boolean;
  onClick?: React.MouseEventHandler;
};

export default Category;
