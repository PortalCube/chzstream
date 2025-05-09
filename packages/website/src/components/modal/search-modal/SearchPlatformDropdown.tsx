import SearchPlatformDropdownMenu from "@web/components/modal/search-modal/SearchPlatformDropdownMenu.tsx";
import { BlockPlatform } from "@web/librarys/block.ts";
import { searchPlatformAtom } from "@web/librarys/search.ts";
import { CHZZK_ICON_URL, YOUTUBE_ICON_URL } from "@web/scripts/constants.ts";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;

  user-select: none;
`;

const Container = styled.button`
  width: 120px;
  padding: 4px 8px;
  border: none;
  border-radius: 24px;

  color: rgb(255, 255, 255);
  background-color: rgb(48, 48, 48);

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
  font-weight: 700;
`;

export type SearchPlatformDropdownItemType = {
  platform: BlockPlatform;
  label: string;
  icon: string;
};

export const SEARCH_PLATFORM_DROPDOWN_ITEMS: SearchPlatformDropdownItemType[] =
  [
    {
      platform: "chzzk",
      label: "치지직",
      icon: CHZZK_ICON_URL,
    },
    // {
    //   platform: "soop",
    //   label: "SOOP",
    //   icon: SOOP_ICON_URL
    // },
    {
      platform: "youtube",
      label: "유튜브",
      icon: YOUTUBE_ICON_URL,
    },
  ];

function SearchPlatformDropdown({}: SearchPlatformDropdownProps) {
  const searchPlatform = useAtomValue(searchPlatformAtom);
  const selectedItem = SEARCH_PLATFORM_DROPDOWN_ITEMS.find(
    (item) => item.platform === searchPlatform
  )!;

  const [show, setShow] = useState(false);

  const onDropdownClick = () => {
    setShow((prev) => !prev);
  };

  const hideDropdown = () => {
    setShow(false);
  };

  return (
    <Wrapper>
      <Container onClick={onDropdownClick}>
        <Icon src={selectedItem.icon} />
        <Label>{selectedItem.label}</Label>
        <MdArrowDropDown size={24} color={"#ffffff"} />
      </Container>
      <SearchPlatformDropdownMenu show={show} hide={hideDropdown} />
    </Wrapper>
  );
}

type SearchPlatformDropdownProps = {};

export default SearchPlatformDropdown;
