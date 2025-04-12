import {
  isMultiSelectAtom,
  isMultiSelectEnabledAtom,
  setMultiSelectAtom,
} from "@web/librarys/search";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import styled from "styled-components";

const Container = styled.button`
  padding: 4px 6px;
  border-radius: 4px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 500;

  background: none;
  color: rgb(159, 159, 159);
  cursor: pointer;

  & > svg {
    color: rgb(127, 127, 127);
  }

  transition:
    color 100ms,
    background-color 100ms;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }

  &.selected {
    color: rgb(61, 249, 177);

    & > svg {
      color: rgb(61, 249, 177);
    }
  }

  &.hidden {
    display: none;
  }
`;

function MultiSelectCheckBox({}: MultiSelectCheckBoxProps) {
  const isMultiSelect = useAtomValue(isMultiSelectAtom);
  const setMultiSelect = useSetAtom(setMultiSelectAtom);
  const isMultiSelectEnabled = useAtomValue(isMultiSelectEnabledAtom);

  const Icon = isMultiSelect ? MdCheckBox : MdCheckBoxOutlineBlank;

  const onClick: React.MouseEventHandler = () => {
    setMultiSelect(!isMultiSelect);
  };

  const className = classNames({
    selected: isMultiSelect,
    hidden: isMultiSelectEnabled === false,
  });

  return (
    <Container className={className} onClick={onClick}>
      다중 선택
      <Icon size={24} />
    </Container>
  );
}

type MultiSelectCheckBoxProps = {};

export default MultiSelectCheckBox;
