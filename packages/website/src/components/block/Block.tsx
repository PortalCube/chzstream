import { RequestMessage } from "@chzstream/message";
import EditBlock from "@web/components/block/edit-block/EditBlock.tsx";
import LoadingOverlay from "@web/components/block/LoadingOverlay.tsx";
import { InfoType } from "@web/components/block/overlay/InfoOverlay.ts";
import InfoOverlay from "@web/components/block/overlay/InfoOverlay.tsx";
import ViewBlock from "@web/components/block/ViewBlock.tsx";
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
import { MessageClient } from "@web/scripts/message.ts";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

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
    if (MessageClient === null) {
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
    const onIframePointerMove = (
      message: RequestMessage<"iframe-pointer-move">
    ) => {
      if (ref === null || ref.current === null) {
        return;
      }
      if (MessageClient === null) return;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== MessageClient.id.id) return;
      if (message.sender.blockId !== id) return;

      const data = message.data;

      const y = data.clientY + ref.current.offsetTop;
      const area = (window.document.body.clientHeight / GRID_SIZE_HEIGHT) * 0.5;
      setMouseTop(y < area);
    };

    if (MessageClient) {
      MessageClient.on("iframe-pointer-move", onIframePointerMove);
    }

    return () => {
      if (MessageClient) {
        MessageClient.remove("iframe-pointer-move", onIframePointerMove);
      }
    };
  }, [id, setMouseTop, ref]);

  useEffect(() => {
    const listener = (message: RequestMessage<"player-status">) => {
      if (MessageClient === null) return;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== MessageClient.id.id) return;
      if (message.sender.blockId !== id) return;

      const data = message.data;

      if (data.type === "ready") {
        setLoaded(true);
        setInfoType(InfoType.None);
        applyPlayerControl(id);
      }

      if (data.type === "end") {
        setLoaded(true);
        setInfoType(InfoType.Offline);
      }

      if (data.type === "adult") {
        setLoaded(true);
        setInfoType(InfoType.Adult);
      }

      if (data.type === "error") {
        setLoaded(true);
        setInfoType(InfoType.Error);
      }
    };

    if (MessageClient !== null) {
      MessageClient.on("player-status", listener);
    }

    return () => {
      if (MessageClient !== null) {
        MessageClient.remove("player-status", listener);
      }
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
