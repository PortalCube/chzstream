import { StreamGetChannelOptions } from "@api/index.ts";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { fetchBlockChannelAtom } from "@web/librarys/api-client";
import { favoriteChannelsAtom } from "@web/librarys/app.ts";
import { BlockChannel } from "@web/librarys/block.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { useChannelDrag } from "@web/librarys/drag-and-drop.ts";
import { pushChannelWithDefaultPresetAtom } from "@web/librarys/preset.ts";
import { FavoriteChannelItem } from "@web/scripts/storage.ts";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div<{ $index: number; $gap: number }>`
  width: 42px;
  height: 42px;

  margin-right: ${({ $gap }) => $gap}px;
  border-radius: 50%;

  box-sizing: border-box;

  overflow: hidden;

  transition:
    transform 100ms,
    margin 100ms;

  background-color: rgba(32, 32, 32, 1);

  z-index: ${({ $index }) => $index};

  cursor: grab;

  &:hover {
    transform: scale(1.3);
    z-index: 1000;
  }

  &:active {
    cursor: grabbing;
  }

  &.active {
    outline: 3px solid #1ed070;
  }

  &:not(.active) {
    filter: grayscale(50%) brightness(0.33);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

function getDefaultChannel(item: FavoriteChannelItem): BlockChannel {
  return {
    platform: item.platform,
    channelId: item.id,
    channelName: "알 수 없음",
    channelImageUrl: getProfileImageUrl(),
    liveId: null,
    liveStatus: false,
    liveTitle: "알 수 없음",
    liveThumbnailUrl: "",
    lastUpdate: null,
  };
}

function getStreamGetChannelOptions(
  item: FavoriteChannelItem
): StreamGetChannelOptions {
  if (item.platform === "chzzk") {
    return {
      platform: "chzzk",
      id: item.id,
    };
  } else if (item.platform === "youtube") {
    return {
      platform: "youtube",
      type: "id",
      value: item.id,
    };
  } else {
    throw new Error("Unsupported platform");
  }
}

function FavoriteChannel({ item, index, gap }: FavoriteChannelProps) {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);
  const messageClient = useAtomValue(messageClientAtom);
  const pushChannelWithDefaultPreset = useSetAtom(
    pushChannelWithDefaultPresetAtom
  );
  const fetchBlockChannel = useSetAtom(fetchBlockChannelAtom);

  const [channel, setChannel] = useState(getDefaultChannel(item));
  const {
    channelName: name,
    channelImageUrl: iconUrl,
    liveStatus,
    lastUpdate,
  } = channel;

  const { dragElement, onDragStart, onDragEnd } = useChannelDrag(channel);

  useEffect(() => {
    const loadChannelInfo = async () => {
      // 마지막 업데이트로부터 60초 이내인 경우 skip
      if (lastUpdate !== null && Date.now() - lastUpdate < 60000) return;

      const blockChannel = await fetchBlockChannel(
        getStreamGetChannelOptions(item)
      );
      setChannel(blockChannel);
    };

    const intervalTimer = setInterval(loadChannelInfo, 3000);
    loadChannelInfo();

    return () => {
      clearInterval(intervalTimer);
    };
  }, [lastUpdate, messageClient, item]);

  const onClick: React.MouseEventHandler = async () => {
    const blockChannel = await fetchBlockChannel(
      getStreamGetChannelOptions(item)
    );
    pushChannelWithDefaultPreset([blockChannel]);
  };

  const onPointerDown: React.PointerEventHandler = (event) => {
    if (event.button === 2) {
      const isDelete = confirm(`${name} 채널을 즐겨찾기에서 삭제할까요?`);
      if (isDelete) {
        setFavoriteChannels(
          favoriteChannels.filter(
            (element) =>
              !(item.id === element.id && item.platform === element.platform)
          )
        );
      }
    }
  };

  return (
    <Container
      $index={index}
      $gap={gap}
      className={classNames({ active: liveStatus })}
      draggable={true}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onPointerDown={onPointerDown}
    >
      {dragElement}
      <Image src={iconUrl} />
    </Container>
  );
}

type FavoriteChannelProps = {
  item: FavoriteChannelItem;
  index: number;
  gap: number;
};

export default FavoriteChannel;
