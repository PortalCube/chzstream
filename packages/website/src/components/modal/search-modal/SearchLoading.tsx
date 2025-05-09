import CircleSpinner from "@web/components/spinner/CircleSpinner.tsx";
import { searchLoadingAtom } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  padding: 36px 0;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 36px;

  &.hidden {
    display: none;
  }
`;

function SearchLoading({}: SearchLoadingProps) {
  const searchLoading = useAtomValue(searchLoadingAtom);

  const className = classNames({
    hidden: searchLoading === false,
  });

  return (
    <Container className={className}>
      <CircleSpinner />
    </Container>
  );
}

type SearchLoadingProps = {};

export default SearchLoading;
