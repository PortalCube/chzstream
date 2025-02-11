import classNames from "classnames";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 36px;

  &.hidden {
    display: none;
  }
`;

const Spliter = styled.div`
  width: 1px;
  height: 18px;

  background-color: rgba(63, 63, 63, 1);
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: none;

  font-weight: 500;
  font-size: 16px;
  color: rgba(127, 127, 127, 1);

  cursor: pointer;

  transition: color 100ms;

  &:hover {
    color: rgba(180, 180, 180, 1);
  }

  &.hidden {
    visibility: hidden;
  }
`;

const Page = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: rgba(127, 127, 127, 1);

  font-variant-numeric: tabular-nums;
`;

function Pagination({
  page,
  maxPage,
  onNextClick,
  onPreviousClick,
  show = true,
}: PaginationProps) {
  const className = classNames({
    hidden: show === false,
  });

  const previousClassName = classNames({
    hidden: page === 1,
  });

  const nextClassName = classNames({
    hidden: page === maxPage,
  });

  return (
    <Container className={className}>
      <Button className={previousClassName} onClick={onPreviousClick}>
        <MdNavigateBefore size={24} />
        이전
      </Button>
      <Spliter />
      <Page>{page} 페이지</Page>
      <Spliter />
      <Button className={nextClassName} onClick={onNextClick}>
        다음
        <MdNavigateNext size={24} />
      </Button>
    </Container>
  );
}

type PaginationProps = {
  page: number;
  maxPage: number;
  onNextClick: () => void;
  onPreviousClick: () => void;
  show?: boolean;
};

export default Pagination;
