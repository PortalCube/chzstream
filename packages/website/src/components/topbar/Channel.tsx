import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { favoriteChannelsAtom } from "@web/librarys/app.ts";
import { BlockChannel } from "@web/librarys/block.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { useChannelDrag } from "@web/librarys/drag-and-drop.ts";
import { fetchChzzkChannelAtom } from "@web/librarys/layout.ts";
import { pushChannelWithDefaultPresetAtom } from "@web/librarys/preset.ts";
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

function getDefaultChannel(uuid: string): BlockChannel {
  return {
    uuid,
    name: "알 수 없음",
    title: "알 수 없음",
    thumbnailUrl: "",
    iconUrl: getProfileImageUrl(),
    lastUpdate: null,
  };
}

function Channel({ uuid, index, gap }: ChannelProps) {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);
  const messageClient = useAtomValue(messageClientAtom);
  const pushChannelWithDefaultPreset = useSetAtom(
    pushChannelWithDefaultPresetAtom
  );
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);

  const [channel, setChannel] = useState(getDefaultChannel(uuid));
  const { name, iconUrl } = channel;

  const { dragElement, onDragStart, onDragEnd } = useChannelDrag(channel);

  useEffect(() => {
    const loadChannelInfo = async () => {
      const channel: BlockChannel = getDefaultChannel(uuid);

      if (messageClient === null) {
        setChannel(channel);
        return;
      }

      const response = await messageClient.request("stream-get-channel", {
        platform: "chzzk",
        id: uuid,
      });
      const data = response.data;

      if (data === null) {
        setChannel(channel);
        return;
      }

      channel.name = data.channelName;
      channel.iconUrl = getProfileImageUrl(data.channelImageUrl);
      channel.lastUpdate = Date.now();
      channel.thumbnailUrl = data.liveThumbnailUrl ?? "";
      channel.title = data.liveTitle ?? "";

      setChannel(channel);
    };

    const intervalTimer = setInterval(() => loadChannelInfo, 30000);
    loadChannelInfo();

    return () => {
      clearInterval(intervalTimer);
    };
  }, [messageClient, uuid]);

  const onClick: React.MouseEventHandler = async () => {
    const channel = await fetchChzzkChannel(uuid);
    pushChannelWithDefaultPreset(channel);
  };

  const onPointerDown: React.PointerEventHandler = (event) => {
    if (event.button === 2) {
      const isDelete = confirm(`${name} 채널을 즐겨찾기에서 삭제할까요?`);
      if (isDelete) {
        setFavoriteChannels(favoriteChannels.filter((item) => item !== uuid));
      }
    }
  };

  return (
    <Container
      $index={index}
      $gap={gap}
      className={classNames({ active: false })}
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

type ChannelProps = {
  uuid: string;
  index: number;
  gap: number;
};

export default Channel;
