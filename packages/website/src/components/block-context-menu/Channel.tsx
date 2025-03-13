import DragImage from "@web/components/drag/DragImage.tsx";
import { clearBlockContextMenuAtom } from "@web/librarys/app.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  fetchChzzkChannelAtom,
  modifyBlockAtom,
} from "@web/librarys/layout.ts";
import { openSearchModalAtom } from "@web/librarys/modal.ts";
import { useSetAtom } from "jotai";
import { useContext, useMemo, useRef } from "react";
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
`;

const Name = styled.div`
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.div`
  color: rgb(127, 127, 127);
  font-size: 14px;
  font-weight: 500;
`;

function Channel() {
  const block = useContext(BlockContextMenuContext);
  const ref = useRef<HTMLImageElement>(null);
  const openSearchModal = useSetAtom(openSearchModalAtom);
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const clearBlockContextMenu = useSetAtom(clearBlockContextMenuAtom);

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
    openSearchModal(async (_channel) => {
      const channel = await fetchChzzkChannel(_channel.uuid);
      modifyBlock({ id, channel });
    });
  };

  const onDragStart: React.DragEventHandler = (event) => {
    if (event.dataTransfer === null) return false;
    if (hasChannel === false) return false;

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

    requestAnimationFrame(clearBlockContextMenu);
  };

  return (
    <Container
      draggable={hasChannel}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      <DragImage _ref={ref} src={iconUrl} name={name} />
      <Image src={iconUrl} draggable="false" />
      <Info>
        <Name>{name}</Name>
        <Description>{description}</Description>
      </Info>
    </Container>
  );
}

export default Channel;
