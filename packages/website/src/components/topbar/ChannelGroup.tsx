import Channel from "@web/components/topbar/Channel.tsx";
import ChannelButton from "@web/components/topbar/ChannelButton.tsx";
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

function ChannelGroup() {
  const [favoriteChannels, setFavoriteChannels] = useAtom(favoriteChannelsAtom);
  const openSearchModal = useSetAtom(openSearchModalAtom);

  const gap = useMemo(
    () => Math.min(-16, -8 - favoriteChannels.length),
    [favoriteChannels]
  );

  const channelElements = favoriteChannels.map((item, index) => (
    <Channel key={item} uuid={item} index={index} gap={gap} />
  ));

  const onAddButtonClick: React.MouseEventHandler = () => {
    openSearchModal((channels) => {
      const items = channels
        .filter((channel) => favoriteChannels.includes(channel.uuid) === false)
        .map((channel) => channel.uuid);

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
      <ChannelButton icon={MdAdd} onClick={onAddButtonClick} gap={gap} />
      <ChannelButton icon={MdRefresh} onClick={onResetButtonClick} gap={gap} />
    </Container>
  );
}

export default ChannelGroup;
