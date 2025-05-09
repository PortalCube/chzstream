import MultiSelect from "@web/components/modal/search-modal/MultiSelect.tsx";
import MultiSelectCheckBox from "@web/components/modal/search-modal/MultiSelectCheckBox.tsx";
import SearchBar from "@web/components/modal/search-modal/SearchBar.tsx";
import SearchDetail from "@web/components/modal/search-modal/SearchDetail.tsx";
import SearchLoading from "@web/components/modal/search-modal/SearchLoading.tsx";
import SearchPlatformDropdown from "@web/components/modal/search-modal/SearchPlatformDropdown.tsx";
import SearchSummary from "@web/components/modal/search-modal/SearchSummary.tsx";
import SearchYoutubeNotice from "@web/components/modal/search-modal/SearchYoutubeNotice.tsx";
import { modalAtom, useModalListener } from "@web/librarys/modal.ts";
import {
  searchPlatformAtom,
  searchQueryAtom,
  setMultiSelectAtom,
  submitSearchAtom,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  max-width: 700px;
  min-height: 780px;
  width: 100%;
  padding: 16px;

  border: 1px solid rgba(63, 63, 63, 1);
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  color: rgba(255, 255, 255, 1);
  background-color: rgba(31, 31, 31, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

  box-sizing: border-box;

  transition: transform 200ms;

  &.disable {
    display: none;
    transform: scale(0.75);
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
`;

function SearchModal({}: SearchModalProps) {
  const modal = useAtomValue(modalAtom);

  const setQuery = useSetAtom(searchQueryAtom);
  const setPlatform = useSetAtom(searchPlatformAtom);
  const submitSearch = useSetAtom(submitSearchAtom);
  const setMultiSelect = useSetAtom(setMultiSelectAtom);

  // 검색 모달이 열리면 초기 값으로 설정
  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type === newVal.type) return;
    if (newVal.type !== "search") return;

    // 다중 선택을 꺼짐으로 변경경
    setMultiSelect(false);

    // 쿼리 초기화
    setQuery("");
    setPlatform("chzzk");
    submitSearch();
  });

  const className = classNames({
    disable: modal.type !== "search",
  });

  return (
    <Container className={className}>
      <Header>
        <SearchBar />
        <SearchPlatformDropdown />
        <MultiSelectCheckBox />
      </Header>
      <SearchSummary />
      <SearchDetail />
      <SearchYoutubeNotice />
      <MultiSelect />
    </Container>
  );
}

type SearchModalProps = {};

export default SearchModal;
