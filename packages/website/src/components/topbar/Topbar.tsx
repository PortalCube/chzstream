import { RequestMessage } from "@chzstream/message";
import ChannelGroup from "@web/components/topbar/ChannelGroup.tsx";
import MenuButton from "@web/components/topbar/MenuButton.tsx";
import { isFullscreenAtom } from "@web/hooks/useFullscreenDetect.tsx";
import { clearBlockAtom, switchLayoutModeAtom } from "@web/librarys/layout.ts";
import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdFullscreen,
  MdFullscreenExit,
  MdOndemandVideo,
  MdRefresh,
  MdSettings,
  MdViewQuilt,
  MdVolumeUp,
} from "react-icons/md";
import styled, { css } from "styled-components";

import LogoImage from "@web/assets/logo.png";
import { messageClientAtom } from "@web/hooks/useMessageClient";
import { layoutModeAtom, mouseIsTopAtom } from "@web/librarys/app.ts";
import {
  openMixerModalAtom,
  openPresetModalAtom,
  openSettingModalAtom,
} from "@web/librarys/modal.ts";
import { Mixin } from "@web/scripts/styled.ts";

const Container = styled.div`
  width: 100%;
  height: var(--height);
  padding: 0 24px;

  z-index: 2;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 24px;

  background-color: #2a2a2a;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  transition: transform 200ms;

  ${Mixin.screen.greater.large(css`
    --height: 70px;
  `)}

  ${Mixin.screen.less.large(css`
    --height: 48px;
  `)}

  &.hide {
    position: absolute;
    transform: translateY(-70px);

    &.mouse-top {
      transform: translateY(0);
    }
  }
`;

const Title = styled.img`
  object-fit: contain;

  ${Mixin.screen.greater.large(css`
    height: 28px;
  `)}

  ${Mixin.screen.less.large(css`
    height: 20px;
  `)}
`;

const MenuGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function Topbar() {
  const isFullscreen = useAtomValue(isFullscreenAtom);
  const [isShow, setShow] = useState(true);
  const [mouseIsTop, setMouseTop] = useAtom(mouseIsTopAtom);
  const messageClient = useAtomValue(messageClientAtom);

  const layoutMode = useAtomValue(layoutModeAtom);
  const clearBlock = useSetAtom(clearBlockAtom);
  const switchLayoutMode = useSetAtom(switchLayoutModeAtom);

  const openSettingModal = useSetAtom(openSettingModalAtom);
  const openMixerModal = useSetAtom(openMixerModalAtom);
  const openPresetModal = useSetAtom(openPresetModalAtom);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }, [isFullscreen]);

  useEffect(() => {
    setShow(isFullscreen === false);
  }, [isFullscreen]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const y = event.clientY;

      setMouseTop(y < 10);
      // if (mouseIsTop) {
      //   setMouseTop(y < 90);
      // } else {
      //   setMouseTop(y < 10);
      // }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(true);
      }

      if (event.key === "F11") {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mouseIsTop, toggleFullscreen]);

  useEffect(() => {
    if (messageClient === null) return;

    const onIframeKeyDown = (message: RequestMessage<"iframe-key-down">) => {
      const key = message.data.key;

      if (key === "F11") {
        toggleFullscreen();
      }
    };

    messageClient.on("iframe-key-down", onIframeKeyDown);

    return () => messageClient.remove("iframe-key-down", onIframeKeyDown);
  }, [toggleFullscreen, messageClient]);

  const buttons = useMemo(() => {
    const onClearButtonClick: React.MouseEventHandler = () => {
      if (confirm("레이아웃을 초기화할까요?") === true) {
        clearBlock();
      }
    };

    const onFoldButtonClick: React.MouseEventHandler = () => {
      setShow((prev) => !prev);

      if (isShow) {
        setMouseTop(false);
      }
    };

    const onModeButtonClick: React.MouseEventHandler = () => {
      switchLayoutMode();
    };

    return [
      {
        key: "refresh",
        Icon: MdRefresh,
        text: "레이아웃 초기화",
        onClick: onClearButtonClick,
        filter: ["modify"],
      },
      {
        key: "preset",
        Icon: MdViewQuilt,
        text: "프리셋",
        onClick: openPresetModal,
        filter: ["modify", "view"],
      },
      {
        key: "fullscreen",
        Icon: isFullscreen ? MdFullscreenExit : MdFullscreen,
        text: isFullscreen ? "전체 화면 종료" : "전체 화면",
        onClick: toggleFullscreen,
        filter: ["modify", "view"],
      },
      {
        key: "mode",
        Icon: layoutMode === "view" ? MdEdit : MdOndemandVideo,
        text: layoutMode === "view" ? "편집 모드" : "시청 모드",
        onClick: onModeButtonClick,
        filter: ["modify", "view"],
      },
      {
        key: "mixer",
        Icon: MdVolumeUp,
        text: "스트림 믹서",
        onClick: openMixerModal,
        filter: ["modify", "view"],
      },
      {
        key: "setting",
        Icon: MdSettings,
        text: "설정",
        onClick: openSettingModal,
        filter: ["modify", "view"],
      },
      {
        key: "fold",
        Icon: isShow ? MdExpandLess : MdExpandMore,
        text: isShow ? "접기" : "펼치기",
        onClick: onFoldButtonClick,
        filter: ["modify", "view"],
      },
    ]
      .filter((item) => item.filter.includes(layoutMode))
      .map((item) => (
        <MenuButton
          key={item.key}
          Icon={item.Icon}
          text={item.text}
          onClick={item.onClick}
        />
      ));
  }, [isShow, layoutMode, isFullscreen, toggleFullscreen]);

  const className = classNames({
    hide: isShow === false,
    "mouse-top": mouseIsTop,
  });

  return (
    <Container
      className={className}
      onPointerMove={(event) => event.stopPropagation()}
    >
      <Title src={LogoImage} alt="chzstream" />
      <ChannelGroup />
      <MenuGroup>{buttons}</MenuGroup>
    </Container>
  );
}

export default Topbar;
