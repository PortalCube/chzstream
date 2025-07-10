import ButtonMenuItem from "@web/components/block-context-menu/ButtonMenuItem.tsx";
import ZoomLevel from "@web/components/block-context-menu/ZoomLevel.tsx";
import {
  blockContextMenuOptionsAtom,
  clearBlockContextMenuAtom,
} from "@web/librarys/block-context-menu.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  modifyBlockAtom,
  modifyBlockStatusAtom,
  quickBlockAddAtom,
  removeBlockAtom,
} from "@web/librarys/layout.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import {
  MdAdd,
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

  &.hidden {
    display: none;
  }
`;

const KeyCode = styled.span`
  margin-right: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  background-color: rgb(49, 49, 49);
  color: rgb(253, 110, 14);
`;

function ButtonMenu() {
  const block = useContext(BlockContextMenuContext);

  const removeBlock = useSetAtom(removeBlockAtom);
  const modifyBlock = useSetAtom(modifyBlockAtom);
  const modifyBlockStatus = useSetAtom(modifyBlockStatusAtom);
  const quickBlockAdd = useSetAtom(quickBlockAddAtom);

  const clearBlockContextMenu = useSetAtom(clearBlockContextMenuAtom);
  const blockContextMenuOptions = useAtomValue(blockContextMenuOptionsAtom);

  const items = useMemo(() => {
    const id = block?.id ?? 0;
    const type = block?.type ?? "stream";

    const blockRemove = () => {
      removeBlock(id);
    };

    const refresh = () => {
      modifyBlockStatus(id, { refresh: true });
    };

    const changeType = () => {
      const newType = type === "chat" ? "stream" : "chat";
      modifyBlock({ id, type: newType });
    };

    const makeFullscreen = () => {};

    const makeFullscreenWithChat = () => {};

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
        id: "quick-add",
        icon: MdAdd,
        title: "채널 추가",
        onClick: quickBlockAdd,
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
  }, [block]);

  const tipClassName = classNames({
    hidden: blockContextMenuOptions?.contextMenu === false,
  });

  return (
    <Container>
      <ZoomLevel />
      {items}
      <Tip className={tipClassName}>
        <KeyCode>Ctrl + 우클릭</KeyCode>으로 기존 메뉴 열기
      </Tip>
    </Container>
  );
}

export default ButtonMenu;
