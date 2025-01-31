import { useAtom } from "jotai";
import { useMemo } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import { favoriteChannelsAtom } from "src/librarys/app.ts";
import { useModal } from "src/librarys/modal.ts";
import { FAVOTIRE_CHANNELS_INITIAL_DATA } from "src/scripts/storage.ts";
import { Mixin } from "src/scripts/styled.ts";
import styled, { css } from "styled-components";
import Channel from "./Channel.tsx";
import ChannelButton from "./ChannelButton.tsx";

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
