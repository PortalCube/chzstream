import DragImage from "@web/components/drag/DragImage.tsx";
import { favoriteChannelsAtom } from "@web/librarys/app";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { MessageClient } from "@web/scripts/message.ts";
import classNames from "classnames";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
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

function Channel({ uuid, index, gap }: ChannelProps) {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);

  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadChannelInfo = async () => {
      if (MessageClient === null) {
        setName("알 수 없음");
        setIconUrl(getProfileImageUrl());
        setActive(false);
        return;
      }

      const response = await MessageClient.request("stream-get-channel", {
        platform: "chzzk",
        id: uuid,
      });
      const data = response.data;

      if (data === null) {
        setName("알 수 없음");
        setIconUrl(getProfileImageUrl());
        setActive(false);
        return;
      }

      setName(data.channelName);
      setIconUrl(getProfileImageUrl(data.channelImageUrl));
      setActive(data.liveStatus);
    };

    const intervalTimer = setInterval(() => {
      loadChannelInfo();
    }, 120000);

    loadChannelInfo();

    return () => {
      clearInterval(intervalTimer);
    };
  }, [uuid]);

  const onDragStart: React.DragEventHandler = (event) => {
    if (event.dataTransfer === null) return;

    if (ref?.current) {
      event.dataTransfer.setDragImage(ref.current, 0, 0);
    }

    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.dropEffect = "copy";

    const data = JSON.stringify({
      _isChannel: true,
      uuid,
      name,
      iconUrl,
    });

    event.dataTransfer.setData("application/json", data);
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
      className={classNames({ active })}
      draggable={true}
      onDragStart={onDragStart}
      onPointerDown={onPointerDown}
    >
      <DragImage _ref={ref} src={iconUrl} name={name} />
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
