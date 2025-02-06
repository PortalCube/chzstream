import classNames from "classnames";
import { MdNavigateNext } from "react-icons/md";
import { SearchCategory, useSearchModal } from "src/librarys/search.ts";
import styled from "styled-components";
import Category from "./Category.tsx";
import SearchList from "./SearchList.tsx";

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
  const { channelResult, liveResult, category, setCategory } = useSearchModal();
  const className = classNames({
    hidden: category !== SearchCategory.Summary,
  });

  return (
    <Container className={className}>
      <Section>
        <Category name="채널" interactable={false} />
        <MoreButton onClick={() => setCategory(SearchCategory.Channel)}>
          모두 보기
          <MdNavigateNext size={24} />
        </MoreButton>
      </Section>
      <SearchList preview size={4} items={channelResult} />
      <Spliter />
      <Section>
        <Category name="라이브" interactable={false} />
        <MoreButton onClick={() => setCategory(SearchCategory.Live)}>
          모두 보기
          <MdNavigateNext size={24} />
        </MoreButton>
      </Section>
      <SearchList preview size={4} items={liveResult} />
    </Container>
  );
}

type SearchSummaryProps = {};

export default SearchSummary;
