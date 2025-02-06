import {
  ClientMessageEvent,
  IframePointerMoveMessage,
  PlayerEventType,
} from "@chzstream/message";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { BlockType } from "src/librarys/block.ts";
import {
  blockListAtom,
  layoutSizeAtom,
  mouseIsTopAtom,
  useLayout,
} from "src/librarys/layout.ts";
import { GRID_SIZE_HEIGHT } from "src/scripts/constants.ts";
import { getGridStyle } from "src/scripts/grid-layout.ts";
import {
  getIframeId,
  MessageClient,
  PlayerEvent,
} from "src/scripts/message.ts";
import styled, { keyframes } from "styled-components";
import EditBlock from "./edit-block/EditBlock.tsx";
import LoadingOverlay from "./LoadingOverlay.tsx";
import { InfoType } from "./overlay/InfoOverlay.ts";
import InfoOverlay from "./overlay/InfoOverlay.tsx";
import ViewBlock from "./ViewBlock.tsx";
import { BlockContext } from "src/librarys/block-context.ts";

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

function Block({ id }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseIsTop, setMouseTop] = useAtom(mouseIsTopAtom);
  const {
    setBlockChannel,
    activateBlockStatus,
    updateChannel,
    setBlockLock,
    swapBlockPosition,
    findBlock,
  } = useLayout();
  const block = findBlock(id);
  const { type, status, position, channel } = block;
  const [loaded, setLoaded] = useState(false);
  const [infoType, setInfoType] = useState<InfoType>(InfoType.None);
  const [[gridWidth, gridHeight]] = useAtom(layoutSizeAtom);

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
  }, [ref]);

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
  }, [id]);

  const onPointerLeave: React.PointerEventHandler = () => {
    setBlockLock(id, true);
  };

  const onDrop: React.DragEventHandler = async (event) => {
    if (event.dataTransfer === null) return;

    event.preventDefault();

    const json = JSON.parse(event.dataTransfer.getData("application/json"));

    if (json._isChannel === true) {
      updateChannel(id, json.uuid);
    } else if (json._isBlock === true) {
      if (position === null) {
        return;
      }

      const data = json as {
        _isBlock: true;
        id: number;
      };

      if (id === data.id) {
        return;
      }

      const block = findBlock(data.id);

      if (block.channel === null) {
        return;
      }

      if (block.position === null) {
        return;
      }

      if (type === BlockType.Chat && block.type === BlockType.Stream) {
        setBlockChannel(id, block.channel);
        activateBlockStatus();

        setLoaded(false);
        setInfoType(InfoType.None);
      } else {
        swapBlockPosition(id, data.id);
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
  id: number;
};

export default Block;
