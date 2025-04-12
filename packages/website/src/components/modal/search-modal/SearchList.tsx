import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useModalListener } from "@web/librarys/modal.ts";
import { SearchItemType, useSearchModal } from "@web/librarys/search.ts";
import styled from "styled-components";
import Pagination from "@web/components/modal/search-modal/Pagination.tsx";
import SearchItem from "@web/components/modal/search-modal/SearchItem";
import SearchMessage from "@web/components/modal/search-modal/SearchMessage.tsx";

const Container = styled.div`
  width: 100%;

  box-sizing: border-box;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  &.preview {
    flex-grow: 0;
  }
`;

const List = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 6px;

  &.live {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 6px;
  }

  &.hidden {
    display: none;
  }
`;

function SearchList({ items, type, size, preview = false }: SearchListProps) {
  const { category } = useSearchModal();
  const [page, setPage] = useState(1);
  const className = classNames({
    preview: preview && items.length !== 0,
  });
  const listClassName = classNames({
    live: type === "live",
    hidden: items.length === 0,
  });

  const itemCount = useMemo(() => {
    if (size !== undefined) {
      return size;
    } else if (type === "live") {
      return 9;
    } else if (type === "channel") {
      return 10;
    }

    return 9;
  }, [type, size]);

  const maxPage = Math.ceil(items.length / itemCount);

  const showPagination = items.length !== 0 && preview === false;

  const elements = useMemo(
    () =>
      items
        .filter(
          (_, index) =>
            index >= (page - 1) * itemCount && index < page * itemCount
        )
        .map((item) => <SearchItem key={item.uuid} item={item} type={type} />),
    [items, itemCount, page]
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
    if (newVal.type !== "search") return;
    setPage(1);
  });

  useEffect(() => {
    setPage(1);
  }, [category]);

  return (
    <Container className={className}>
      <List className={listClassName}>{elements}</List>
      <SearchMessage show={items.length === 0} />
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
  type: "channel" | "live";
};

export default SearchList;
