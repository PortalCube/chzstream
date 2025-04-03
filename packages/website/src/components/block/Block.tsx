import { RequestMessage } from "@chzstream/message";
import DragOverlay from "@web/components/block/DragOverlay.tsx";
import EditBlock from "@web/components/block/edit-block/EditBlock.tsx";
import LoadingOverlay from "@web/components/block/LoadingOverlay.tsx";
import InfoOverlay from "@web/components/block/overlay/InfoOverlay.tsx";
import ViewBlock from "@web/components/block/ViewBlock.tsx";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { layoutModeAtom, mouseIsTopAtom } from "@web/librarys/app.ts";
import { blockContextMenuOptionsAtom } from "@web/librarys/block-context-menu.ts";
import type { Block } from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context.ts";
import { dragStatusAtom } from "@web/librarys/drag-and-drop.ts";
import { modifyBlockStatusAtom } from "@web/librarys/layout.ts";
import { applyPlayerControlAtom } from "@web/librarys/mixer.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
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
  const { id, position } = block;
  const ref = useRef<HTMLDivElement>(null);
  const messageClient = useAtomValue(messageClientAtom);
  const [mouseIsTop, setMouseTop] = useAtom(mouseIsTopAtom);
  const layoutMode = useAtomValue(layoutModeAtom);

  const [blockContextMenuOptions, setBlockContextMenuOptions] = useAtom(
    blockContextMenuOptionsAtom
  );

  const modifyBlockStatus = useSetAtom(modifyBlockStatusAtom);
  const applyPlayerControl = useSetAtom(applyPlayerControlAtom);
  const dragStatus = useAtomValue(dragStatusAtom);

  // TODO: useMessageListenerAtom 만들기 (1)
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

      if (mouseIsTop) {
        setMouseTop(y < 110);
      } else {
        setMouseTop(y < 10);
      }
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

        setBlockContextMenuOptions({ id, x, y, contextMenu: true });
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
  }, [messageClient, id, mouseIsTop, ref, gridRef, blockContextMenuOptions]);

  // TODO: useMessageListenerAtom 만들기 (2)
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
        modifyBlockStatus(id, { loading: false, error: null });
        applyPlayerControl(id);
      }

      // 플레이어가 종료됨
      if (data.type === "end") {
        modifyBlockStatus(id, { loading: false, error: "offline" });
      }

      // 성인 제한으로 인해 재생 불가
      if (data.type === "adult") {
        modifyBlockStatus(id, { loading: false, error: "adult" });
      }

      // 오류로 인해 재생 불가
      if (data.type === "error") {
        modifyBlockStatus(id, { loading: false, error: "error" });
      }
    };

    messageClient.on("player-status", listener);

    return () => {
      messageClient.remove("player-status", listener);
    };
  }, [messageClient, id]);

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

  const onPointerEnter: React.PointerEventHandler = () => {
    if (dragStatus !== "none") return;
    modifyBlockStatus(id, { droppable: false });
  };

  const onPointerLeave: React.PointerEventHandler = () => {
    modifyBlockStatus(id, { droppable: true });
  };

  const className = classNames({ "modify-mode": layoutMode === "modify" });

  const style = getGridStyle(position);

  return (
    <BlockContext.Provider value={block}>
      <Container
        ref={ref}
        style={style}
        className={className}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onContextMenu={onContextMenu}
      >
        <DragOverlay />
        <InfoOverlay />
        <LoadingOverlay />
        <EditBlock />
        <ViewBlock />
      </Container>
    </BlockContext.Provider>
  );
}

type BlockProps = {
  block: Block;
  gridRef: React.RefObject<HTMLDivElement | null>;
};

export default Block;
