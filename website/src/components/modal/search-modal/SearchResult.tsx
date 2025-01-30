import classNames from "classnames";
import { ModalEventType, ModalType, useModal } from "src/librarys/modal.ts";
import styled from "styled-components";
import Category from "./Category.tsx";
import SearchSummary from "./SearchSummary.tsx";
import SearchDetail from "./SearchDetail.tsx";
import { useEffect, useState } from "react";
import { useSearchModal } from "src/librarys/search-modal.ts";

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
  const { addModalListener, removeModalListener } = useModal();
  const { setQuery, showRecommend } = useSearchModal();
  const className = classNames({});

  useEffect(() => {
    const onOpen = () => {
      setQuery("");
      showRecommend();
    };

    addModalListener(ModalType.Search, ModalEventType.Open, onOpen);
    return () => {
      removeModalListener(ModalType.Search, ModalEventType.Open, onOpen);
    };
  }, []);

  return (
    <Container className={className}>
      <SearchSummary />
      <SearchDetail />
    </Container>
  );
}

type SearchResultProps = {};

export default SearchResult;
