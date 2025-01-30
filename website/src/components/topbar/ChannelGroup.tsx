import { MdAdd, MdRefresh } from "react-icons/md";
import styled, { css } from "styled-components";
import Channel from "./Channel.tsx";
import ChannelButton from "./ChannelButton.tsx";
import { useMemo, useState } from "react";
import { favoriteChannelsAtom } from "src/librarys/app.ts";
import { useAtom } from "jotai";
import { FAVOTIRE_CHANNELS_INITIAL_DATA } from "src/scripts/storage.ts";
import { useModal } from "src/librarys/modal.ts";
import {
  extraSmallScreenMixin,
  largeScreenMixin,
  mediumScreenMixin,
  smallScreenMixin,
} from "src/scripts/styled.ts";

const Container = styled.div`
  display: flex;
  gap: 12px;

  ${extraSmallScreenMixin(css`
    display: none;
  `)}

  ${smallScreenMixin(css`
    display: none;
  `)}
  
  ${mediumScreenMixin(css`
    display: none;
  `)}

  ${largeScreenMixin(css`
    display: flex;
  `)}
`;

function ChannelGroup() {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);
  const { openSearchModal } = useModal();

  const gap = useMemo(
    () => Math.min(-16, -8 - favoriteChannels.length),
    [favoriteChannels]
  );

  const channelElements = favoriteChannels.map((item, index) => (
    <Channel key={item} uuid={item} index={index} gap={gap} />
  ));

  const onAddButtonClick: React.MouseEventHandler = () => {
    openSearchModal((channel) => {
      if (favoriteChannels.includes(channel.uuid) === false) {
        setFavoriteChannels([...favoriteChannels, channel.uuid]);
      }
    });
  };

  const onResetButtonClick: React.MouseEventHandler = () => {
    const isReset = confirm("즐겨찾기 채널을 기본값으로 초기화할까요?");
    if (isReset) {
      setFavoriteChannels(FAVOTIRE_CHANNELS_INITIAL_DATA);
    }
  };

  return (
    <Container>
      {channelElements}
      <ChannelButton icon={MdAdd} onClick={onAddButtonClick} gap={gap} />
      <ChannelButton icon={MdRefresh} onClick={onResetButtonClick} gap={gap} />
    </Container>
  );
}

export default ChannelGroup;
