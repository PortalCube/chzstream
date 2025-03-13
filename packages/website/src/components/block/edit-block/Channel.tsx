import { useSetAtom } from "jotai";
import { useContext, useMemo, useRef } from "react";
import DragImage from "@web/components/drag/DragImage.tsx";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContext } from "@web/librarys/context";
import {
  fetchChzzkChannelAtom,
  modifyBlockAtom,
} from "@web/librarys/layout.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { Mixin } from "@web/scripts/styled.ts";
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
  const ref = useRef<HTMLImageElement>(null);
  const openSearchModal = useSetAtom(openSearchModalAtom);
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const block = useContext(BlockContext);
  const { id, channel } = block;

  const { iconUrl, name, title } = useMemo(() => {
    if (channel === null) {
      return {
        iconUrl: getProfileImageUrl(),
        name: "채널 없음" + " " + id,
        title: "여기를 클릭해서 채널을 지정하세요",
      };
    }

    return {
      iconUrl: channel.iconUrl,
      name: channel.name,
      title: channel.title,
    };
  }, [channel]);

  const onClick: React.MouseEventHandler = () => {
    openSearchModal(async (_channel) => {
      const channel = await fetchChzzkChannel(_channel.uuid);
      modifyBlock({ id, channel });
    });
  };

  const onDragStart: React.DragEventHandler = (event) => {
    if (event.dataTransfer === null) return false;

    if (channel === null) return false;

    if (ref?.current) {
      event.dataTransfer.setDragImage(ref.current, 0, 0);
    }

    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.dropEffect = "move";

    const data = JSON.stringify({
      _isBlock: true,
      block: block,
    });

    event.dataTransfer.setData("application/json", data);
  };

  return (
    <Container
      draggable={channel !== null}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      <DragImage _ref={ref} src={iconUrl} name={name} />
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
