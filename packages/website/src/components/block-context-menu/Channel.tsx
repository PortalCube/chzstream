import { clearBlockContextMenuAtom } from "@web/librarys/block-context-menu.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import { useBlockDrag } from "@web/librarys/drag-and-drop.ts";
import {
  fetchChzzkChannelAtom,
  setBlockChannelAtom,
} from "@web/librarys/layout.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 8px;

  border: 2px dashed rgb(53, 53, 53);
  border-style: dashed;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  cursor: pointer;

  transition-property: background-color;
  transition-duration: 100ms;

  user-select: none;
  -webkit-user-select: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.025);
  }
`;

const Image = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 2px;

  overflow: hidden;
`;

const Name = styled.div`
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 600;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.div`
  color: rgb(127, 127, 127);
  font-size: 14px;
  font-weight: 500;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function Channel() {
  const block = useContext(BlockContextMenuContext);
  const openSearchModal = useSetAtom(openSearchModalAtom);
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);
  const setBlockChannel = useSetAtom(setBlockChannelAtom);
  const clearBlockContextMenu = useSetAtom(clearBlockContextMenuAtom);

  const { dragElement, onDragStart, onDragEnd } = useBlockDrag(block);

  const { id, iconUrl, name, description, hasChannel } = useMemo(() => {
    const result = {
      id: 0,
      iconUrl: getProfileImageUrl(),
      name: "채널 없음",
      description: "클릭해서 채널 지정",
      hasChannel: false,
    };

    if (block === null) {
      return result;
    }

    result.id = block.id;

    if (block.channel === null) {
      return result;
    }

    result.iconUrl = block.channel.iconUrl;
    result.name = block.channel.name;
    result.description = "클릭하거나 드래그";
    result.hasChannel = true;

    return result;
  }, [block]);

  const onClick: React.MouseEventHandler = () => {
    clearBlockContextMenu();
    openSearchModal(
      async (channels) => {
        const uuid = channels[0].uuid;
        const channel = await fetchChzzkChannel(uuid);
        setBlockChannel(id, channel);
      },
      { allowMultiSelect: false }
    );
  };

  return (
    <Container
      draggable={hasChannel}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {dragElement}
      <Image src={iconUrl} draggable="false" />
      <Info>
        <Name>{name}</Name>
        <Description>{description}</Description>
      </Info>
    </Container>
  );
}

export default Channel;
