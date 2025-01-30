import classNames from "classnames";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  padding: 36px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &.hidden {
    display: none;
  }
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  color: rgba(175, 175, 175, 1);
`;

function SearchMessage({ show = false }: SearchMessageProps) {
  const className = classNames({
    hidden: !show,
  });
  return (
    <Container className={className}>
      <Title>검색 결과가 없습니다</Title>
      <Description>다른 키워드로 검색해보세요.</Description>
    </Container>
  );
}

type SearchMessageProps = {
  show: boolean;
};

export default SearchMessage;
