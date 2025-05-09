import { SearchPlatformDropdownItemType } from "@web/components/modal/search-modal/SearchPlatformDropdown.tsx";
import classNames from "classnames";
import styled from "styled-components";

const Container = styled.button`
  padding: 8px;
  border: none;

  color: rgb(255, 255, 255);
  background-color: rgb(31, 31, 31);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  cursor: pointer;
  transition-property: background-color;
  transition-duration: 100ms;

  &:hover {
    background-color: rgb(63, 63, 63);
  }
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;

  object-fit: contain;
`;

const Label = styled.span`
  text-align: left;
  flex-grow: 1;

  font-size: 14px;
  font-weight: 500;
`;

function SearchPlatformDropdownItem({
  item,
  onClick,
}: SearchPlatformDropdownItemProps) {
  return (
    <Container onClick={() => onClick(item)}>
      <Icon src={item.icon} />
      <Label>{item.label}</Label>
    </Container>
  );
}

type SearchPlatformDropdownItemProps = {
  item: SearchPlatformDropdownItemType;
  onClick: (item: SearchPlatformDropdownItemType) => void;
};

export default SearchPlatformDropdownItem;
