import ButtonMenuItem from "@web/components/block-context-menu/ButtonMenuItem.tsx";
import { clearBlockContextMenuAtom } from "@web/librarys/block-context-menu.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  modifyBlockAtom,
  modifyBlockStatusAtom,
  removeBlockAtom,
} from "@web/librarys/layout.ts";
import { useSetAtom } from "jotai";
import { useCallback, useContext, useMemo } from "react";
import {
  MdChromeReaderMode,
  MdDelete,
  MdForum,
  MdFullscreen,
  MdRefresh,
  MdSmartDisplay,
} from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
`;

const Tip = styled.p`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 400;
  color: rgb(127, 127, 127);
`;

function ButtonMenu() {
  const block = useContext(BlockContextMenuContext);

  const removeBlock = useSetAtom(removeBlockAtom);
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const modifyBlockStatus = useSetAtom(modifyBlockStatusAtom);
  const clearBlockContextMenu = useSetAtom(clearBlockContextMenuAtom);

  const { id } = useMemo(() => {
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

  const blockRemove = useCallback(() => {
    removeBlock(id);
  }, [id]);

  const refresh = useCallback(() => {
    modifyBlockStatus(id, { refresh: true });
  }, [id]);

  const changeType = useCallback(() => {
    const type = block?.type === "chat" ? "stream" : "chat";
    modifyBlock({ id, type });
  }, [id, block]);

  const makeFullscreen = useCallback(() => {}, []);

  const makeFullscreenWithChat = useCallback(() => {}, []);

  const items = useMemo(() => {
    const items = [
      {
        id: "remove",
        icon: MdDelete,
        title: "블록 삭제",
        onClick: blockRemove,
      },
      {
        id: "refresh",
        icon: MdRefresh,
        title: "블록 새로고침",
        onClick: refresh,
      },
      {
        id: "chat-block",
        icon: MdForum,
        title: "채팅 블록으로 변경",
        onClick: changeType,
        disable: block?.type === "chat",
      },
      {
        id: "stream-block",
        icon: MdSmartDisplay,
        title: "스트리밍 블록으로 변경",
        onClick: changeType,
        disable: block?.type === "stream",
      },
      {
        id: "fullscreen",
        icon: MdFullscreen,
        title: "전체 화면 (F)",
        onClick: makeFullscreen,
        disable: true,
      },
      {
        id: "fullscreen-chat",
        icon: MdChromeReaderMode,
        title: "채팅 있는 전체화면 (G)",
        onClick: makeFullscreenWithChat,
        disable: true,
      },
    ];

    return items
      .filter((item) => item.disable !== true)
      .map((item) => (
        <ButtonMenuItem
          key={item.id}
          icon={item.icon}
          title={item.title}
          onClick={() => {
            clearBlockContextMenu();
            item.onClick();
          }}
        />
      ));
  }, [block, blockRemove, refresh, makeFullscreen, makeFullscreenWithChat]);

  return (
    <Container>
      {items}
      <Tip>참고: Ctrl + 우클릭으로 원래 메뉴 열기</Tip>
    </Container>
  );
}

export default ButtonMenu;
