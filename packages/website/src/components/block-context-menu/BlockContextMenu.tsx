import { RequestMessage } from "@message/index.ts";
import ButtonMenu from "@web/components/block-context-menu/ButtonMenu.tsx";
import Channel from "@web/components/block-context-menu/Channel.tsx";
import MixerItem from "@web/components/block-context-menu/MixerItem.tsx";
import MixerQuality from "@web/components/block-context-menu/MixerQuality.tsx";
import MixerVolume from "@web/components/block-context-menu/MixerVolume.tsx";
import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import {
  blockContextMenuOptionsAtom,
  blockListAtom,
} from "@web/librarys/app.ts";
import { Block } from "@web/librarys/block.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 240px;
  padding: 12px;

  box-sizing: border-box;

  border: 1px solid rgb(63, 63, 63);
  border-radius: 8px;

  position: fixed;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;

  background-color: rgb(31, 31, 31);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);

  transition-property: opacity;
  transition-duration: 50ms;

  &.disable {
    opacity: 0;
    pointer-events: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgb(53, 53, 53);
`;

function BlockContextMenu() {
  const ref = useRef<HTMLDivElement>(null);
  const messageClient = useAtomValue(messageClientAtom);
  const blockList = useAtomValue(blockListAtom);
  const [blockContextMenu, setBlockContextMenu] = useState<Block | null>(null);
  const [blockContextMenuOptions, setBlockContextMenuOptions] = useAtom(
    blockContextMenuOptionsAtom
  );
  const className = classNames({ disable: blockContextMenuOptions === null });

  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (blockContextMenuOptions === null) return;
    if (ref.current === null) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let x = blockContextMenuOptions.x;
    let y = blockContextMenuOptions.y;

    const rect = ref.current.getBoundingClientRect();

    const margin = 24;

    if (rect.width + x + margin >= screenWidth) {
      x -= rect.width;
    }

    if (rect.height + y + margin >= screenHeight) {
      y -= rect.height;
    }

    setStyle({
      left: x,
      top: y,
    });

    const find = blockList.find(
      (block) => block.id === blockContextMenuOptions.id
    );
    if (find === undefined) return;

    setBlockContextMenu(find);
  }, [ref, blockList, blockContextMenuOptions]);

  const onContextMenu: React.MouseEventHandler = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (ref.current === null) return;
    const element = ref.current;

    const pointerListener = (event: PointerEvent) => {
      setBlockContextMenuOptions(null);
    };

    const keyListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBlockContextMenuOptions(null);
      }
    };

    const noPropagation = (event: Event) => {
      event.stopPropagation();
    };

    element.addEventListener("pointerdown", noPropagation);
    window.addEventListener("pointerdown", pointerListener);
    window.addEventListener("keydown", keyListener);

    return () => {
      element.removeEventListener("pointerdown", noPropagation);
      window.removeEventListener("pointerdown", pointerListener);
      window.removeEventListener("keydown", keyListener);
    };
  }, [ref]);

  useEffect(() => {
    if (messageClient === null) return;

    const pointerListener = (
      message: RequestMessage<"iframe-pointer-down">
    ) => {
      const websiteId = messageClient.id.id;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== websiteId) return;

      setBlockContextMenuOptions(null);
    };

    const keyListener = (message: RequestMessage<"iframe-key-down">) => {
      const websiteId = messageClient.id.id;

      if (message.sender.type !== "content") return;
      if (message.sender.websiteId !== websiteId) return;

      const data = message.data;

      if (data.key === "Escape") {
        setBlockContextMenuOptions(null);
      }
    };

    messageClient.on("iframe-pointer-down", pointerListener);
    messageClient.on("iframe-key-down", keyListener);

    return () => {
      messageClient.remove("iframe-pointer-down", pointerListener);
      messageClient.remove("iframe-key-down", keyListener);
    };
  }, [messageClient]);

  const mixer = useMemo(() => {
    if (blockContextMenu === null) return null;
    if (blockContextMenu.type !== "stream") return null;

    return (
      <>
        <MixerQuality />
        <MixerVolume />
        <MixerItem />
        <Divider />
      </>
    );
  }, [blockContextMenu]);

  return (
    <BlockContextMenuContext value={blockContextMenu}>
      <Container
        ref={ref}
        className={className}
        style={style}
        onContextMenu={onContextMenu}
      >
        <Channel />
        {mixer}
        <ButtonMenu />
      </Container>
    </BlockContextMenuContext>
  );
}

export default BlockContextMenu;
