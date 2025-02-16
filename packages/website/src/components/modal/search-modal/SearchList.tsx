import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { ModalType, useModalListener } from "@web/librarys/modal.ts";
import { SearchItemType, useSearchModal } from "@web/librarys/search.ts";
import styled from "styled-components";
import Pagination from "@web/components/modal/search-modal/Pagination.tsx";
import SearchItem from "@web/components/modal/search-modal/SearchItem.tsx";
import SearchMessage from "@web/components/modal/search-modal/SearchMessage.tsx";

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

  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type === newVal.type) return;
    if (newVal.type !== ModalType.Search) return;
    setPage(1);
  });

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
