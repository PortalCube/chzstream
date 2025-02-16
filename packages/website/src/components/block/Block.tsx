import {
  ClientMessageEvent,
  IframePointerMoveMessage,
  PlayerEventType,
} from "@chzstream/message";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { layoutSizeAtom, mouseIsTopAtom } from "@web/librarys/app.ts";
import type { Block } from "@web/librarys/block.ts";
import { BlockType } from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context.ts";
import {
  activateBlockAtom,
  fetchChzzkChannelAtom,
  modifyBlockAtom,
  swapBlockAtom,
} from "@web/librarys/layout.ts";
import { applyPlayerControlAtom } from "@web/librarys/mixer.ts";
import { GRID_SIZE_HEIGHT } from "@web/scripts/constants.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import {
  getIframeId,
  MessageClient,
  PlayerEvent,
} from "@web/scripts/message.ts";
import styled, { keyframes } from "styled-components";
import EditBlock from "@web/components/block/edit-block/EditBlock.tsx";
import LoadingOverlay from "@web/components/block/LoadingOverlay.tsx";
import { InfoType } from "@web/components/block/overlay/InfoOverlay.ts";
import InfoOverlay from "@web/components/block/overlay/InfoOverlay.tsx";
import ViewBlock from "@web/components/block/ViewBlock.tsx";

const popinAnimation = keyframes`
  0% {
    transform: scale(0.97);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  overflow: hidden;

  user-select: none;
  -webkit-user-select: none;

  position: relative;

  container-type: size;
  container-name: block;

  animation-name: ${popinAnimation};
  animation-duration: 200ms;
  animation-timing-function: ease-out;
`;

function Block({ block }: BlockProps) {
  const { id, type, status, position, channel } = block;
  const ref = useRef<HTMLDivElement>(null);
  const setMouseTop = useSetAtom(mouseIsTopAtom);

  const modifyBlock = useSetAtom(modifyBlockAtom);
  const activateBlock = useSetAtom(activateBlockAtom);
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);
  const swapBlock = useSetAtom(swapBlockAtom);
  const applyPlayerControl = useSetAtom(applyPlayerControlAtom);

  const [loaded, setLoaded] = useState(false);
  const [infoType, setInfoType] = useState<InfoType>(InfoType.None);
  const [gridWidth, gridHeight] = useAtomValue(layoutSizeAtom);

  useEffect(() => {
    if (MessageClient.active === false) {
      setLoaded(true);
      setInfoType(InfoType.None);
    } else if (channel === null) {
      setLoaded(true);
      setInfoType(InfoType.NoChannel);
    } else if (status === false) {
      setLoaded(false);
      setInfoType(InfoType.None);
    }
  }, [status, channel]);

  useEffect(() => {
    const onIframePointerMove = ({
      detail: message,
    }: ClientMessageEvent<IframePointerMoveMessage>) => {
      if (ref === null || ref.current === null) {
        return;
      }

      if (message.sender === null) {
        return;
      }

      if (getIframeId(message.sender) !== id) {
        return;
      }

      const y = message.data.clientY + ref.current.offsetTop;

      const area = (window.document.body.clientHeight / GRID_SIZE_HEIGHT) * 0.5;
      setMouseTop(y < area);
    };

    MessageClient.addEventListener("iframe-pointer-move", onIframePointerMove);

    return () => {
      MessageClient.removeEventListener(
        "iframe-pointer-move",
        onIframePointerMove
      );
    };
  }, [id, setMouseTop, ref]);

  useEffect(() => {
    const listener = ({ detail: message }: PlayerEvent) => {
      if (message.sender === null) {
        return;
      }

      if (getIframeId(message.sender) !== id) {
        return;
      }

      if (message.data.event === PlayerEventType.Ready) {
        setLoaded(true);
        setInfoType(InfoType.None);
        applyPlayerControl(id);
      }

      if (message.data.event === PlayerEventType.End) {
        setLoaded(true);
        setInfoType(InfoType.Offline);
      }

      if (message.data.event === PlayerEventType.Adult) {
        setLoaded(true);
        setInfoType(InfoType.Adult);
      }

      if (message.data.event === PlayerEventType.Error) {
        setLoaded(true);
        setInfoType(InfoType.Error);
      }
    };

    MessageClient.addEventListener("player-event", listener);

    return () => {
      MessageClient.removeEventListener("player-event", listener);
    };
  }, [id, applyPlayerControl]);

  const onPointerLeave: React.PointerEventHandler = () => {
    modifyBlock({ id, lock: true });
  };

  const onDrop: React.DragEventHandler = async (event) => {
    if (event.dataTransfer === null) return;

    event.preventDefault();

    const json = JSON.parse(event.dataTransfer.getData("application/json"));

    if (json._isChannel === true) {
      await fetchChzzkChannel(id, json.uuid);
    } else if (json._isBlock === true) {
      if (position === null) {
        return;
      }

      const data = json as {
        _isBlock: true;
        block: Block;
      };

      if (id === data.block.id) {
        return;
      }

      if (data.block.channel === null) {
        return;
      }

      if (data.block.position === null) {
        return;
      }

      if (type === BlockType.Chat && data.block.type === BlockType.Stream) {
        modifyBlock({ id, channel: data.block.channel });
        activateBlock();

        setLoaded(false);
        setInfoType(InfoType.None);
      } else {
        swapBlock(id, data.block.id);
      }
    }
  };

  const preventDragHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  const style = getGridStyle(position, gridWidth, gridHeight);

  return (
    <BlockContext.Provider value={block}>
      <Container
        ref={ref}
        style={style}
        onPointerLeave={onPointerLeave}
        onDrop={onDrop}
        onDragEnter={preventDragHandler}
        onDragOver={preventDragHandler}
      >
        <InfoOverlay type={infoType} />
        <LoadingOverlay loaded={loaded} />
        <EditBlock />
        <ViewBlock loaded={loaded} />
      </Container>
    </BlockContext.Provider>
  );
}

type BlockProps = {
  block: Block;
};

export default Block;
