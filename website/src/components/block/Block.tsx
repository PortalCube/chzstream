import {
  ClientMessageEvent,
  IframePointerMoveMessage,
  PlayerEventType,
} from "@chzstream/message";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { BlockType } from "src/librarys/block.ts";
import {
  _findBlock,
  activateBlockStatus,
  applicationModeAtom,
  blockListAtom,
  findBlock,
  gridSizeAtom,
  mouseIsTopAtom,
  setBlockChannel,
  setBlockLock,
  setBlockPosition,
  useGrid,
} from "src/librarys/grid.ts";
import { GRID_SIZE_HEIGHT } from "src/scripts/constants.ts";
import { getGridStyle } from "src/scripts/grid-layout.ts";
import { MessageClient, PlayerEvent } from "src/scripts/message.ts";
import styled, { keyframes } from "styled-components";
import EditBlock from "./edit-block/EditBlock.tsx";
import LoadingOverlay from "./LoadingOverlay.tsx";
import { InfoType } from "./overlay/InfoOverlay.ts";
import InfoOverlay from "./overlay/InfoOverlay.tsx";
import ViewBlock from "./ViewBlock.tsx";

const popinAnimation = keyframes`
    0% {
        transform: scale(0.9);
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
  const [mode, setMode] = useAtom(applicationModeAtom);
  const [blockList, setBlockList] = useAtom(blockListAtom);

  const [mouseIsTop, setMouseTop] = useAtom(mouseIsTopAtom);
  const { updateChannel } = useGrid();
  const { type, status, position, channel } = findBlock(id);
  const [loaded, setLoaded] = useState(false);
  const [infoType, setInfoType] = useState<InfoType>(InfoType.None);

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

      if (message.data.iframeId !== id) {
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
      if (message.data.iframeId !== id) {
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

  const [[gridWidth, gridHeight]] = useAtom(gridSizeAtom);

  const style = getGridStyle(position, gridWidth, gridHeight);

  const onPointerLeave: React.PointerEventHandler = () => {
    setBlockList(setBlockLock(id, true));
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

      const block = _findBlock(data.id, blockList);

      if (block === null) {
        return;
      }

      if (block.channel === null) {
        return;
      }

      if (block.position === null) {
        return;
      }

      if (type === BlockType.Chat && block.type === BlockType.Stream) {
        setBlockList(setBlockChannel(id, block.channel));
        setBlockList(activateBlockStatus());
        setLoaded(false);
        setInfoType(InfoType.None);
      } else {
        setBlockList(setBlockPosition(id, block.position));
        setBlockList(setBlockPosition(data.id, position));
      }
    }
  };

  const onDragEnter: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  const onDragOver: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      ref={ref}
      style={style}
      onPointerLeave={onPointerLeave}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
    >
      <InfoOverlay id={id} type={infoType} />
      <LoadingOverlay id={id} loaded={loaded} />
      <EditBlock id={id} />
      <ViewBlock id={id} loaded={loaded} />
    </Container>
  );
}

type BlockProps = {
  id: number;
};

export default Block;
