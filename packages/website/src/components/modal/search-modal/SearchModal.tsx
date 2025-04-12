import SearchBar from "@web/components/modal/search-modal/SearchBar.tsx";
import SearchDetail from "@web/components/modal/search-modal/SearchDetail.tsx";
import SearchSummary from "@web/components/modal/search-modal/SearchSummary.tsx";
import { modalAtom, useModalListener } from "@web/librarys/modal.ts";
import { useSearchModal } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
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

function SearchModal({}: SearchModalProps) {
  const modal = useAtomValue(modalAtom);

  const { setQuery, showRecommend } = useSearchModal();

  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type === newVal.type) return;
    if (newVal.type !== "search") return;
    setQuery("");
    showRecommend();
  });

  const className = classNames({
    disable: modal.type !== "search",
  });

  return (
    <Container className={className}>
      <SearchBar />
      <SearchSummary />
      <SearchDetail />
    </Container>
  );
}

type SearchModalProps = {};

export default SearchModal;
