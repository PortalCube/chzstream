import { StreamGetChannelOptions } from "@api/index.ts";
import {
  createStreamGetChannelOptions,
  fetchBlockChannelAtom,
} from "@web/librarys/api-client";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContext } from "@web/librarys/context";
import { useBlockDrag } from "@web/librarys/drag-and-drop.ts";
import { setBlockChannelAtom } from "@web/librarys/layout.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { Mixin } from "@web/scripts/styled.ts";
import { useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  position: absolute;

  transition:
    left 100ms,
    right 100ms,
    bottom 100ms;

  left: var(--block-margin);
  right: var(--block-margin);
  bottom: var(--block-margin);

  padding: 8px;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  line-height: 1.2;
  text-align: center;
  color: #f0f0f0;

  flex-grow: 1;

  cursor: pointer;

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;

  transition: gap 100ms;

  ${Mixin.block.greater.large(css`
    gap: 12px;
  `)}

  ${Mixin.block.less.large(css`
    gap: 8px;
  `)}
`;

const Icon = styled.img`
  border-radius: 50%;
  object-fit: cover;
  background-color: rgba(32, 32, 32, 1);

  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);

  transition:
    width 100ms,
    height 100ms;

  ${Mixin.block.greater.large(css`
    width: 54px;
    height: 54px;
  `)}

  ${Mixin.block.less.large(css`
    width: 36px;
    height: 36px;
  `)}

  ${Mixin.block.less.medium(css`
    width: 28px;
    height: 28px;
  `)}

  ${Mixin.block.less.small(css`
    width: 20px;
    height: 20px;
  `)}
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;

  & > p {
    width: 100%;

    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;

    text-align: left;

    text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  }
`;

const Name = styled.p`
  font-weight: 800;

  transition: font-size 100ms;

  ${Mixin.block.greater.large(css`
    font-size: 24px;
  `)}

  ${Mixin.block.less.large(css`
    font-size: 18px;
  `)}

  ${Mixin.block.less.medium(css`
    font-size: 14px;
  `)}

  ${Mixin.block.less.small(css`
    font-size: 12px;
  `)}
`;

const Title = styled.p`
  font-weight: 400;

  transition: font-size 100ms;

  ${Mixin.block.greater.large(css`
    font-size: 18px;
  `)}

  ${Mixin.block.less.large(css`
    font-size: 13px;
  `)}

  ${Mixin.block.less.medium(css`
    font-size: 11px;
  `)}

  ${Mixin.block.less.small(css`
    font-size: 9px;
    display: none;
  `)}
`;

function Channel({}: ChannelProps) {
  const block = useContext(BlockContext);
  const { id, channel } = block;
  const openSearchModal = useSetAtom(openSearchModalAtom);
  const fetchBlockChannel = useSetAtom(fetchBlockChannelAtom);
  const setBlockChannel = useSetAtom(setBlockChannelAtom);
  const { dragElement, onDragStart, onDragEnd } = useBlockDrag(block);

  const { iconUrl, name, title } = useMemo(() => {
    const result = {
      iconUrl: getProfileImageUrl(),
      name: "채널 없음",
      title: "여기를 클릭해서 채널을 지정하세요",
    };

    if (channel === null) {
      return result;
    }

    result.iconUrl = channel.channelImageUrl;
    result.name = channel.channelName;
    result.title = channel.liveTitle;

    return result;
  }, [channel]);

  const onClick: React.MouseEventHandler = () => {
    openSearchModal(
      async (channels) => {
        const channel = channels[0];

        const options = createStreamGetChannelOptions(channel);

        if (options === null) {
          return;
        }

        const blockChannel = await fetchBlockChannel(options);
        setBlockChannel(id, blockChannel);
      },
      { allowMultiSelect: false }
    );
  };

  return (
    <Container
      draggable={channel !== null}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {dragElement}
      <InfoGroup>
        <Icon src={iconUrl} draggable="false" />
        <TextGroup>
          <Name>{name}</Name>
          <Title>{title}</Title>
        </TextGroup>
      </InfoGroup>
    </Container>
  );
}

type ChannelProps = {};

export default Channel;
