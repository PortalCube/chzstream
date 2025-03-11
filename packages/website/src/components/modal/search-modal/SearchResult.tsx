import SearchDetail from "@web/components/modal/search-modal/SearchDetail.tsx";
import SearchSummary from "@web/components/modal/search-modal/SearchSummary.tsx";
import { useModalListener } from "@web/librarys/modal.ts";
import { useSearchModal } from "@web/librarys/search.ts";
import classNames from "classnames";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin-top: 20px;

  padding: 16px;
  box-sizing: border-box;

  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 1);
  background-color: rgba(31, 31, 31, 1);
  border: 1px solid rgba(63, 63, 63, 1);
`;

function SearchResult({}: SearchResultProps) {
  const { setQuery, showRecommend } = useSearchModal();
  const className = classNames({});

  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type === newVal.type) return;
    if (newVal.type !== "search") return;
    setQuery("");
    showRecommend();
  });

  return (
    <Container className={className}>
      <SearchSummary />
      <SearchDetail />
    </Container>
  );
}

type SearchResultProps = {};

export default SearchResult;
