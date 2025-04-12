import { useLoadingImage } from "@web/hooks/useLoadingImage.tsx";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { closeModalAtom, modalAtom } from "@web/librarys/modal.ts";
import { SearchItemType } from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { MdVerified } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  width: 210px;
  padding: 4px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: background-color 100ms;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }
`;

const Thumbnail = styled.img`
  width: 210px;
  height: 118px;
  border-radius: 8px;
`;

const Channel = styled.div`
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChannelImage = styled.img`
  flex-shrink: 0;

  width: 28px;
  height: 28px;
  border-radius: 50%;

  object-fit: cover;

  background-color: rgba(63, 63, 63, 1);
`;

const Info = styled.div`
  min-width: 0;
  flex-grow: 1;
  flex-shrink: 1;

  display: flex;
  flex-direction: column;

  gap: 2px;
`;

const LiveTitle = styled.p`
  width: 100%;
  color: rgba(243, 243, 243, 1);
  font-weight: 500;
  font-size: 13px;

  // 비표준이지만 치지직에서도 쓰니까 괜찮을듯
  // https://caniuse.com/?search=-webkit-line-clamp
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  white-space: wrap;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChannelNameGroup = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 2px;
`;

const Name = styled.p`
  color: rgba(159, 159, 159, 1);
  font-weight: 400;
  font-size: 13px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Verified = styled(MdVerified)`
  width: 14px;
  height: 14px;

  flex-shrink: 0;

  color: rgba(45, 254, 153, 1);

  &.hidden {
    display: none;
  }
`;

const loadingImageUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjcHd3/w8AA4MB1ZQ8LjIAAAAASUVORK5CYII=";

function SearchLiveItem({ item }: SearchItemProps) {
  const modal = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);
  const className = classNames({});

  const verifiedClassName = classNames({
    hidden: item.verified === false,
  });

  const profileImage = useMemo(
    () => getProfileImageUrl(item.channelImage),
    [item]
  );

  const thumbnailUrl = (item.thumbnailImage ?? "").replace("{type}", "320");
  const thumbnail = useLoadingImage(thumbnailUrl, loadingImageUrl);

  const onClick: React.MouseEventHandler = () => {
    modal.callback?.(item);
    closeModal();
  };

  return (
    <Container className={className} onClick={onClick}>
      <Thumbnail src={thumbnail} alt={item.description} />
      <Channel>
        <ChannelImage src={profileImage} />
        <Info>
          <LiveTitle>{item.description}</LiveTitle>
          <ChannelNameGroup>
            <Name>{item.title}</Name>
            <Verified className={verifiedClassName} />
          </ChannelNameGroup>
        </Info>
      </Channel>
    </Container>
  );
}

export type SearchItemProps = {
  item: SearchItemType;
};

export default SearchLiveItem;
