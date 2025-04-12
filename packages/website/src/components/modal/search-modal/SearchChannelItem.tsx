import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { MdVerified } from "react-icons/md";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { closeModalAtom, modalAtom } from "@web/librarys/modal.ts";
import { SearchItemType } from "@web/librarys/search.ts";
import { formatFollowerCount } from "@web/scripts/format.ts";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  padding: 0 8px;
  border-radius: 4px;

  height: 50px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  cursor: pointer;

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }
`;

const Verified = styled(MdVerified)`
  width: 16px;
  height: 16px;

  color: rgba(45, 254, 153, 1);

  flex-shrink: 0;

  &.hidden {
    display: none;
  }
`;

const ChannelImage = styled.img`
  flex-shrink: 0;

  width: 36px;
  height: 36px;
  border-radius: 50%;

  object-fit: cover;

  background-color: rgba(63, 63, 63, 1);
`;

const ChannelInfo = styled.div`
  min-width: 0;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  gap: 2px;
`;

const ChannelNameGroup = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const Name = styled.p`
  color: rgba(243, 243, 243, 1);
  font-weight: 600;
  font-size: 16px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  width: 100%;

  color: rgba(159, 159, 159, 1);
  font-weight: 400;
  font-size: 15px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChannelLive = styled.span`
  padding: 2px 8px;
  border-radius: 2px;

  font-size: 13px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(226, 33, 65);

  &.hidden {
    display: none;
  }
`;

const ChannelFollower = styled.span`
  flex-shrink: 0;

  color: rgba(159, 159, 159, 1);
  font-weight: 400;
  font-size: 15px;

  font-variant-numeric: tabular-nums;
`;

function SearchChannelItem({ item }: SearchItemProps) {
  const modal = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);
  const className = classNames({});

  const verifiedClassName = classNames({
    hidden: item.verified === false,
  });

  const liveClassName = classNames({
    hidden: item.liveStatus === false,
  });

  const profileImage = useMemo(
    () => getProfileImageUrl(item.channelImage),
    [item]
  );

  const count = useMemo(
    () => [item.countPrefix, formatFollowerCount(item.count)].join(" "),
    [item]
  );

  const onClick: React.MouseEventHandler = () => {
    modal.callback?.(item);
    closeModal();
  };

  return (
    <Container className={className} onClick={onClick}>
      <ChannelImage src={profileImage} />
      <ChannelInfo>
        <ChannelNameGroup>
          <Name>{item.title}</Name>
          <Verified className={verifiedClassName} />
        </ChannelNameGroup>
        <Description>{item.description}</Description>
      </ChannelInfo>
      <ChannelLive className={liveClassName}>LIVE</ChannelLive>
      <ChannelFollower>{count}</ChannelFollower>
    </Container>
  );
}

export type SearchItemProps = {
  item: SearchItemType;
};

export default SearchChannelItem;
