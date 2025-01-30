import classNames from "classnames";
import { ModalEventType, ModalType, useModal } from "src/librarys/modal.ts";
import styled from "styled-components";
import Category from "./Category.tsx";
import Pagination from "./Pagination.tsx";
import SearchMessage from "./SearchMessage.tsx";
import { SearchItemType, useSearchModal } from "src/librarys/search-modal.ts";
import SearchItem from "./SearchItem.tsx";
import { useEffect, useMemo, useState } from "react";

const Container = styled.div`
  width: 100%;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;
`;

const List = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 8px;
`;

function SearchList({ items, size = 10, preview = false }: SearchListProps) {
  const { addModalListener, removeModalListener } = useModal();
  const { category } = useSearchModal();
  const [page, setPage] = useState(1);
  const className = classNames({});
  const maxPage = Math.ceil(items.length / size);

  const showPagination = items.length !== 0 && preview === false;

  const elements = useMemo(
    () =>
      items
        .filter((_, index) => index >= (page - 1) * size && index < page * size)
        .map((item) => <SearchItem key={item.uuid} item={item} />),
    [items, size, page]
  );

  const onNextClick = () => {
    if (page === maxPage) {
      return;
    }

    setPage(page + 1);
  };

  const onPreviousClick = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
  };

  useEffect(() => {
    const onOpen = () => {
      setPage(1);
    };

    addModalListener(ModalType.Search, ModalEventType.Open, onOpen);
    return () => {
      removeModalListener(ModalType.Search, ModalEventType.Open, onOpen);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [category]);

  return (
    <Container className={className}>
      <List>
        {elements}
        <SearchMessage show={items.length === 0} />
      </List>
      <Pagination
        page={page}
        maxPage={maxPage}
        onNextClick={onNextClick}
        onPreviousClick={onPreviousClick}
        show={showPagination}
      />
    </Container>
  );
}

type SearchListProps = {
  items: SearchItemType[];
  size?: number;
  preview?: boolean;
};

export default SearchList;
