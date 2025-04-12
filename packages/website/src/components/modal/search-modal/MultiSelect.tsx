import MultiSelectList from "@web/components/modal/search-modal/MultiSelectList.tsx";
import {
  isMultiSelectAtom,
  selectedItemsAtom,
  submitSelectedItemAtom,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 16px;

  &.hidden {
    display: none;
  }
`;

const Spliter = styled.div`
  width: 100%;
  height: 1px;

  background-color: rgba(72, 72, 72, 1);
`;

const Submit = styled.button`
  padding: 8px;
  border: none;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgb(0, 0, 0);
  background-color: rgb(44, 222, 136);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  transition:
    color 100ms,
    background-color 100ms;

  &.disabled {
    color: rgb(111, 111, 111);
    background-color: rgb(43, 43, 43);
  }
`;

function MultiSelect({}: MultiSelectProps) {
  const submitItems = useSetAtom(submitSelectedItemAtom);
  const selectedItems = useAtomValue(selectedItemsAtom);
  const isMultiSelect = useAtomValue(isMultiSelectAtom);
  const submitText =
    selectedItems.length > 0
      ? `선택된 ${selectedItems.length}개 채널을 추가`
      : "채널을 선택하세요";

  const onClick: React.MouseEventHandler = () => {
    if (selectedItems.length === 0) return;
    submitItems();
  };

  const className = classNames({
    hidden: isMultiSelect === false,
  });

  const submitClassName = classNames({
    disabled: selectedItems.length === 0,
  });

  return (
    <Container className={className}>
      <Spliter />
      <MultiSelectList />
      <Submit className={submitClassName} onClick={onClick}>
        {submitText}
      </Submit>
    </Container>
  );
}

type MultiSelectProps = {};

export default MultiSelect;
