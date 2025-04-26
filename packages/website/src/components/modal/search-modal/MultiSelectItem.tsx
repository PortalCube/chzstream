import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import {
  removeSelectedItemAtom,
  SearchItemType,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { MdVerified } from "react-icons/md";
import styled from "styled-components";

const Container = styled.button`
  padding: 4px;
  border: none;
  border-radius: 4px;

  flex-shrink: 0;

  display: flex;
  gap: 4px;

  cursor: pointer;
  transition: background-color 100ms;

  background: none;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }
`;

const ChannelImage = styled.img`
  flex-shrink: 0;

  width: 20px;
  height: 20px;
  border-radius: 50%;

  object-fit: cover;

  background-color: rgba(63, 63, 63, 1);
`;

const ChannelName = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  color: rgba(146, 146, 146, 1);

  font-size: 13px;
  font-weight: 500;
`;

const Verified = styled(MdVerified)`
  width: 14px;
  height: 14px;

  color: rgba(45, 254, 153, 1);

  flex-shrink: 0;

  &.hidden {
    display: none;
  }
`;

function MultiSelectItem({ item }: MultiSelectItemProps) {
  const removeSelectedItem = useSetAtom(removeSelectedItemAtom);

  const profileImage = useMemo(
    () => getProfileImageUrl(item.channelImageUrl),
    [item]
  );

  const verifiedClassName = classNames({
    hidden: item.verified === false,
  });

  const onClick: React.MouseEventHandler = () => {
    removeSelectedItem(item);
  };

  return (
    <Container onClick={onClick}>
      <ChannelImage src={profileImage} alt={item.title} />
      <ChannelName>
        {item.title}
        <Verified className={verifiedClassName} />
      </ChannelName>
    </Container>
  );
}

type MultiSelectItemProps = {
  item: SearchItemType;
};

export default MultiSelectItem;
