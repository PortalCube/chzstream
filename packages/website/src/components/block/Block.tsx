import { RequestMessage } from "@chzstream/message";
import DragOverlay from "@web/components/block/DragOverlay.tsx";
import EditBlock from "@web/components/block/edit-block/EditBlock.tsx";
import LoadingOverlay from "@web/components/block/LoadingOverlay.tsx";
import { InfoType } from "@web/components/block/overlay/InfoOverlay.ts";
import InfoOverlay from "@web/components/block/overlay/InfoOverlay.tsx";
import ViewBlock from "@web/components/block/ViewBlock.tsx";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { layoutModeAtom, mouseIsTopAtom } from "@web/librarys/app.ts";
import { blockContextMenuOptionsAtom } from "@web/librarys/block-context-menu.ts";
import type { Block } from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context.ts";
import {
  fetchChzzkChannelAtom,
  modifyBlockAtom,
  swapBlockAtom,
} from "@web/librarys/layout.ts";
import { applyPlayerControlAtom } from "@web/librarys/mixer.ts";
import { GRID_SIZE_HEIGHT } from "@web/scripts/constants.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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

  &.modify-mode {
    transition-property: left, top, right, bottom;
    transition-duration: 100ms;
    transition-timing-function: ease-out;
  }
`;

function Block({ block, gridRef }: BlockProps) {
  const { id, type, status, position, channel } = block;
  const ref = useRef<HTMLDivElement>(null);
  const messageClient = useAtomValue(messageClientAtom);
  const setMouseTop = useSetAtom(mouseIsTopAtom);
  const layoutMode = useAtomValue(layoutModeAtom);

  const [blockContextMenuOptions, setBlockContextMenuOptions] = useAtom(
    blockContextMenuOptionsAtom
  );
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const fetchChzzkChannel = useSetAtom(fetchChzzkChannelAtom);
  const swapBlock = useSetAtom(swapBlockAtom);
  const applyPlayerControl = useSetAtom(applyPlayerControlAtom);

  const [loaded, setLoaded] = useState(false);
  const [infoType, setInfoType] = useState<InfoType>("none");

  useEffect(() => {
    if (messageClient === null) {
      // 제한 모드
      setLoaded(true);
      setInfoType("none");
    } else if (channel === null) {
      // 채널이 없음
      setLoaded(true);
      setInfoType("no-channel");
    } else if (status === false) {
      // 아직 로딩 안됨
      setLoaded(false);
      setInfoType("none");
    }
  }, [messageClient, status, channel]);

  useEffect(() => {
    if (messageClient === null) return;

    const onIframePointerMove = (
      message: RequestMessage<"iframe-pointer-move">
    ) => {
      if (ref === null || ref.current === null) {
        return;
      }

      const websiteId = messageClient.id.id;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== websiteId) return;
      if (message.sender.blockId !== id) return;

      const data = message.data;

      const y = data.clientY + ref.current.offsetTop;
      const area = (window.document.body.clientHeight / GRID_SIZE_HEIGHT) * 0.5;
      setMouseTop(y < area);
    };

    const onIframeContextMenu = (
      message: RequestMessage<"iframe-contextmenu">
    ) => {
      if (ref === null || ref.current === null) {
        return;
      }

      const websiteId = messageClient.id.id;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== websiteId) return;
      if (message.sender.blockId !== id) return;

      const data = message.data;

      const gridTop = gridRef.current?.offsetTop ?? 0;

      if (gridRef.current === null) return;

      if (blockContextMenuOptions === null) {
        const x = data.clientX + ref.current.offsetLeft;
        const y = data.clientY + ref.current.offsetTop + gridTop;

        setBlockContextMenuOptions({ id, x, y });
      } else {
        setBlockContextMenuOptions(null);
      }
    };

    messageClient.on("iframe-pointer-move", onIframePointerMove);
    messageClient.on("iframe-contextmenu", onIframeContextMenu);

    return () => {
      messageClient.remove("iframe-pointer-move", onIframePointerMove);
      messageClient.remove("iframe-contextmenu", onIframeContextMenu);
    };
  }, [messageClient, id, setMouseTop, ref, gridRef, blockContextMenuOptions]);

  useEffect(() => {
    if (messageClient === null) return;

    const listener = (message: RequestMessage<"player-status">) => {
      const websiteId = messageClient.id.id;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== websiteId) return;
      if (message.sender.blockId !== id) return;

      const data = message.data;

      // 플레이어가 준비됨
      if (data.type === "ready") {
        setLoaded(true);
        setInfoType("none");
        applyPlayerControl(id);
      }

      // 플레이어가 종료됨
      if (data.type === "end") {
        setLoaded(true);
        setInfoType("offline");
      }

      // 성인 제한으로 인해 재생 불가
      if (data.type === "adult") {
        setLoaded(true);
        setInfoType("adult");
      }

      // 오류로 인해 재생 불가
      if (data.type === "error") {
        setLoaded(true);
        setInfoType("error");
      }
    };

    messageClient.on("player-status", listener);

    return () => {
      messageClient.remove("player-status", listener);
    };
  }, [messageClient, id, applyPlayerControl]);

  const onContextMenu: React.MouseEventHandler = (event) => {
    // Ctrl키를 누른 경우, 원래 메뉴를 표시
    if (event.ctrlKey === true) return;

    event.preventDefault();

    if (blockContextMenuOptions === null) {
      setBlockContextMenuOptions({
        id,
        x: event.clientX,
        y: event.clientY,
      });
    } else {
      setBlockContextMenuOptions(null);
    }
  };

  const onDrop: React.DragEventHandler = async (event) => {
    if (event.dataTransfer === null) return;

    event.preventDefault();

    const json = JSON.parse(event.dataTransfer.getData("application/json"));

    if (json._isChannel === true) {
      const channel = await fetchChzzkChannel(json.uuid);
      modifyBlock({ id, channel });
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

      if (type === "chat" && data.block.type === "stream") {
        modifyBlock({ id, channel: data.block.channel });

        setLoaded(false);
        setInfoType("none");
      } else {
        swapBlock(id, data.block.id);
      }
    }
  };

  const preventDragHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  const className = classNames({ "modify-mode": layoutMode === "modify" });

  const style = getGridStyle(position);

  return (
    <BlockContext.Provider value={block}>
      <Container
        ref={ref}
        style={style}
        className={className}
        onContextMenu={onContextMenu}
        onDrop={onDrop}
        onDragEnter={preventDragHandler}
        onDragOver={preventDragHandler}
      >
        <DragOverlay />
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
  gridRef: React.RefObject<HTMLDivElement | null>;
};

export default Block;
