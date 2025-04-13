import Category from "@web/components/modal/search-modal/Category.tsx";
import SearchList from "@web/components/modal/search-modal/SearchList.tsx";
import {
  searchCategoryAtom,
  channelResultAtom,
  liveResultAtom,
  SearchItemResult,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  box-sizing: border-box;

  flex-grow: 1;

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

function SearchDetail({}: SearchDetailProps) {
  const [category, setCategory] = useAtom(searchCategoryAtom);
  const liveResult = useAtomValue(liveResultAtom);
  const channelResult = useAtomValue(channelResultAtom);

  const className = classNames({
    hidden: category === "summary",
  });

  const { items, type } = useMemo<{
    items: SearchItemResult[];
    type: "channel" | "live";
  }>(() => {
    if (category === "channel") {
      return { items: channelResult, type: "channel" };
    }

    if (category === "live" || category === "recommend") {
      return { items: liveResult, type: "live" };
    }

    return { items: [], type: "channel" };
  }, [category, channelResult, liveResult]);

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
      <SearchList items={items} type={type} />
    </Container>
  );
}

type SearchDetailProps = {};

export default SearchDetail;
