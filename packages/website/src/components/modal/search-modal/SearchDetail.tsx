import Category from "@web/components/modal/search-modal/Category.tsx";
import SearchList from "@web/components/modal/search-modal/SearchList.tsx";
import { useSearchModal } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useMemo } from "react";
import styled from "styled-components";

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
    hidden: category === "summary",
  });

  const items = useMemo(() => {
    if (category === "channel") {
      return channelResult;
    }

    if (category === "live") {
      return liveResult;
    }

    return recommendResult;
  }, [category, channelResult, liveResult, recommendResult]);

  return (
    <Container className={className}>
      <Group>
        <Category
          hidden={category === "recommend"}
          name="채널"
          active={category === "channel"}
          onClick={() => setCategory("channel")}
        />
        <Category
          hidden={category === "recommend"}
          name="라이브"
          active={category === "live"}
          onClick={() => setCategory("live")}
        />
        <Category
          hidden={category !== "recommend"}
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
