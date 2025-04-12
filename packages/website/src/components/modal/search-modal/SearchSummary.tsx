import Category from "@web/components/modal/search-modal/Category.tsx";
import SearchList from "@web/components/modal/search-modal/SearchList.tsx";
import {
  searchCategoryAtom,
  channelResultAtom,
  liveResultAtom,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { MdNavigateNext } from "react-icons/md";
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

const Section = styled.div`
  display: flex;
  gap: 12px;
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

  font-size: 15px;
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

function SearchSummary({}: SearchSummaryProps) {
  const [category, setCategory] = useAtom(searchCategoryAtom);

  const channelResult = useAtomValue(channelResultAtom);
  const liveResult = useAtomValue(liveResultAtom);

  const className = classNames({
    hidden: category !== "summary",
  });

  return (
    <Container className={className}>
      <Section>
        <Category name="채널" interactable={false} />
        <MoreButton onClick={() => setCategory("channel")}>
          모두 보기
          <MdNavigateNext size={24} />
        </MoreButton>
      </Section>
      <SearchList preview size={3} items={channelResult} type="channel" />
      <Spliter />
      <Section>
        <Category name="라이브" interactable={false} />
        <MoreButton onClick={() => setCategory("live")}>
          모두 보기
          <MdNavigateNext size={24} />
        </MoreButton>
      </Section>
      <SearchList preview size={6} items={liveResult} type="live" />
    </Container>
  );
}

type SearchSummaryProps = {};

export default SearchSummary;
