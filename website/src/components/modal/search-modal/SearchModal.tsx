import classNames from "classnames";
import { useAtomValue } from "jotai";
import { modalAtom, ModalType } from "src/librarys/modal.ts";
import styled from "styled-components";
import SearchBar from "./SearchBar.tsx";
import SearchResult from "./SearchResult.tsx";

const Container = styled.div`
  max-width: 600px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  gap: 12px;

  transition: transform 200ms;

  &.disable {
    display: none;
    transform: scale(0.75);
  }
`;

const Title = styled.p`
  margin-left: 2px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
`;

const Hint = styled.p`
  margin-left: 2px;
  display: flex;
  align-items: center;
  gap: 4px;

  color: rgba(159, 159, 159, 1);
  font-size: 14px;
  font-weight: 600;
`;

function SearchModal({}: SearchModalProps) {
  const modal = useAtomValue(modalAtom);

  const className = classNames({
    disable: modal.type !== ModalType.Search,
  });

  return (
    <Container className={className}>
      <Title>채널 검색</Title>
      <SearchBar />
      <SearchResult />
    </Container>
  );
}

type SearchModalProps = {};

export default SearchModal;
