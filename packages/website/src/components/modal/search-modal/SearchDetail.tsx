import classNames from "classnames";
import { useMemo } from "react";
import { SearchCategory, useSearchModal } from "@web/librarys/search.ts";
import styled from "styled-components";
import Category from "@web/components/modal/search-modal/Category.tsx";
import SearchList from "@web/components/modal/search-modal/SearchList.tsx";

const Container = styled.div`
  width: 100%;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 16px;

  &.hidden {
    display: none;
  }
`;

const Group = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  background: none;
  border: none;
  border-radius: 4px;

  font-size: 16px;
  font-weight: 500;

  color: rgba(127, 127, 127, 1);

  cursor: pointer;

  transition: color 100ms;

  &:hover {
    color: rgba(180, 180, 180, 1);
  }
`;

const Spliter = styled.div`
  width: 100%;
  height: 1px;

  background-color: rgba(72, 72, 72, 1);
`;

function SearchDetail({}: SearchDetailProps) {
  const { category, setCategory, recommendResult, channelResult, liveResult } =
    useSearchModal();
  const className = classNames({
    hidden: category === SearchCategory.Summary,
  });

  const items = useMemo(() => {
    if (category === SearchCategory.Channel) {
      return channelResult;
    }

    if (category === SearchCategory.Live) {
      return liveResult;
    }

    return recommendResult;
  }, [category, channelResult, liveResult, recommendResult]);

  return (
    <Container className={className}>
      <Group>
        <Category
          hidden={category === SearchCategory.Recommend}
          name="채널"
          active={category === SearchCategory.Channel}
          onClick={() => setCategory(SearchCategory.Channel)}
        />
        <Category
          hidden={category === SearchCategory.Recommend}
          name="라이브"
          active={category === SearchCategory.Live}
          onClick={() => setCategory(SearchCategory.Live)}
        />
        <Category
          hidden={category !== SearchCategory.Recommend}
          name="인기 라이브"
          interactable={false}
        />
      </Group>
      <SearchList items={items} />
    </Container>
  );
}

type SearchDetailProps = {};

export default SearchDetail;
