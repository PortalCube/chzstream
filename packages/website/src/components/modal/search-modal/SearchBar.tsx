import { searchQueryAtom, submitSearchAtom } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtom, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  padding: 6px 12px;
  border-radius: 8px;

  box-sizing: border-box;

  background-color: rgba(51, 51, 51, 1);

  flex-grow: 1;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  transition: outline 100ms;

  outline: 2px solid rgba(128, 128, 128, 0);

  cursor: text;

  &.focus {
    outline: 2px solid rgba(128, 128, 128, 1);
  }
`;

const SearchIcon = styled(MdSearch)`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(128, 128, 128, 1);
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  background: none;

  font-weight: 600;
  font-size: 16px;

  color: rgba(220, 220, 220, 1);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: rgba(128, 128, 128, 1);
  }
`;

const Button = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  background: none;

  cursor: pointer;

  color: rgba(128, 128, 128, 1);

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }

  &.hidden {
    visibility: hidden;
  }
`;

function SearchBar({}: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useAtom(searchQueryAtom);
  const submitSearch = useSetAtom(submitSearchAtom);

  const [isFocus, setFocus] = useState(false);

  const className = classNames({
    focus: isFocus,
  });

  const clearClassName = classNames({
    hidden: query === "",
  });

  const onClick = (strict: boolean = false) => {
    return (event: React.MouseEvent) => {
      if (strict && event.target !== event.currentTarget) return;

      if (ref.current !== null) {
        ref.current.focus();
      }
    };
  };

  const onInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  const onFocusChange = (value: boolean) => {
    return () => setFocus(value);
  };

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      submitSearch();
    }
  };

  const onClearClick: React.MouseEventHandler = () => {
    setQuery("");
    submitSearch();
  };

  return (
    <Container className={className} onClick={onClick(true)}>
      <SearchIcon onClick={onClick(false)} />
      <Input
        type="text"
        placeholder="채널 이름, 라이브 제목, UUID로 검색…"
        value={query}
        ref={ref}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onFocus={onFocusChange(true)}
        onBlur={onFocusChange(false)}
      />
      <Button onClick={onClearClick} className={clearClassName}>
        <MdClose size={24} />
      </Button>
    </Container>
  );
}

type SearchBarProps = {};

export default SearchBar;
