import {
  SEARCH_PLATFORM_DROPDOWN_ITEMS,
  SearchPlatformDropdownItemType,
} from "@web/components/modal/search-modal/SearchPlatformDropdown.tsx";
import SearchPlatformDropdownItem from "@web/components/modal/search-modal/SearchPlatformDropdownItem.tsx";
import {
  searchPlatformAtom,
  searchQueryAtom,
  submitSearchAtom,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useSetAtom } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  width: 120px;

  border: 1px solid rgb(63, 63, 63);
  border-radius: 4px;

  background-color: rgb(63, 63, 63);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);

  box-sizing: border-box;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  gap: 1px;

  position: absolute;
  left: 0;
  top: 40px;

  &.hidden {
    display: none;
  }
`;

function SearchPlatformDropdownMenu({
  show,
  hide,
}: SearchPlatformDropdownProps) {
  const setSearchPlatform = useSetAtom(searchPlatformAtom);
  const setQuery = useSetAtom(searchQueryAtom);
  const submitSearch = useSetAtom(submitSearchAtom);

  const className = classNames({
    hidden: !show,
  });

  const onItemClick = (item: SearchPlatformDropdownItemType) => {
    setSearchPlatform(item.platform);
    setQuery("");
    submitSearch();
    hide();
  };

  const items = SEARCH_PLATFORM_DROPDOWN_ITEMS.map((item) => (
    <SearchPlatformDropdownItem
      key={item.platform}
      item={item}
      onClick={onItemClick}
    />
  ));

  return <Container className={className}>{items}</Container>;
}

type SearchPlatformDropdownProps = {
  show: boolean;
  hide: () => void;
};

export default SearchPlatformDropdownMenu;
