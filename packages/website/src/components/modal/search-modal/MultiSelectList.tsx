import MultiSelectItem from "@web/components/modal/search-modal/MultiSelectItem.tsx";
import { selectedItemsAtom } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  overflow: hidden;
`;

const Header = styled.span`
  font-size: 16px;
  font-weight: 600;

  flex-shrink: 0;

  color: rgb(255, 255, 255);
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  overflow: auto;
  scrollbar-width: none;
  scrollbar-color: rgb(96, 96, 96) rgb(34, 34, 34);
`;

const Empty = styled.p`
  margin-top: 2px;
  padding: 4px 0;
  color: rgb(159, 159, 159);

  font-weight: 500;
  font-size: 14px;

  &.hidden {
    display: none;
  }
`;

function MultiSelectList({}: MultiSelectListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const selectedItems = useAtomValue(selectedItemsAtom);

  const items = [...selectedItems]
    .reverse()
    .map((item) => <MultiSelectItem key={item.channelId} item={item} />);

  const emptyClassName = classNames({
    hidden: items.length > 0,
  });

  const onWheel = (event: React.WheelEvent) => {
    if (ref.current && event.shiftKey === false) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + Math.sign(event.deltaY) * 30,
      });
    }
  };

  return (
    <Container>
      <Header>선택된 채널</Header>
      <List ref={ref} onWheel={onWheel}>
        {items}
      </List>
      <Empty className={emptyClassName}>선택된 채널이 없습니다</Empty>
    </Container>
  );
}

type MultiSelectListProps = {};

export default MultiSelectList;
