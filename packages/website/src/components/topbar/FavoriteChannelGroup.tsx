import FavoriteChannel from "@web/components/topbar/FavoriteChannel.tsx";
import FavoriteChannelButton from "@web/components/topbar/FavoriteChannelButton.tsx";
import { favoriteChannelsAtom } from "@web/librarys/app.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { FAVOTIRE_CHANNELS_INITIAL_DATA } from "@web/scripts/storage.ts";
import { Mixin } from "@web/scripts/styled.ts";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 12px;

  ${Mixin.screen.greater.large(css`
    display: flex;
  `)}

  ${Mixin.screen.less.large(css`
    display: none;
  `)}
`;

function FavoriteChannelGroup() {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);
  const openSearchModal = useSetAtom(openSearchModalAtom);

  const gap = useMemo(
    () => Math.min(-16, -8 - favoriteChannels.length),
    [favoriteChannels]
  );

  const channelElements = favoriteChannels.map((item, index) => (
    <FavoriteChannel
      key={`${item.id}-${item.platform}`}
      item={item}
      index={index}
      gap={gap}
    />
  ));

  const onAddButtonClick: React.MouseEventHandler = () => {
    openSearchModal((channels) => {
      const items = channels
        .filter(
          (channel) =>
            favoriteChannels.includes({
              platform: channel.platform,
              id: channel.channelId,
            }) === false
        )
        .map((channel) => ({
          platform: channel.platform,
          id: channel.channelId,
        }));

      setFavoriteChannels([...favoriteChannels, ...items]);
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
      <FavoriteChannelButton
        icon={MdAdd}
        onClick={onAddButtonClick}
        gap={gap}
      />
      <FavoriteChannelButton
        icon={MdRefresh}
        onClick={onResetButtonClick}
        gap={gap}
      />
    </Container>
  );
}

export default FavoriteChannelGroup;
