import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import {
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdFullscreen,
  MdFullscreenExit,
  MdOndemandVideo,
  MdRefresh,
  MdSettings,
  MdVolumeUp,
} from "react-icons/md";
import { isFullscreenAtom } from "src/hooks/useFullscreenDetect.tsx";
import {
  clearBlockAtom,
  LayoutMode,
  switchLayoutModeAtom,
} from "src/librarys/layout.ts";
import { GRID_SIZE_HEIGHT } from "src/scripts/constants.ts";
import styled, { css } from "styled-components";
import ChannelGroup from "./ChannelGroup.tsx";
import MenuButton from "./MenuButton.tsx";

import LogoImage from "src/assets/logo.png";
import { layoutModeAtom, mouseIsTopAtom } from "src/librarys/app.ts";
import {
  openMixerModalAtom,
  openSettingModalAtom,
} from "src/librarys/modal.ts";
import { Mixin } from "src/scripts/styled.ts";

const Container = styled.div`
  width: 100%;
  height: var(--height);
  padding: 0 24px;

  z-index: 1;

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

  const layoutMode = useAtomValue(layoutModeAtom);
  const clearBlock = useSetAtom(clearBlockAtom);
  const switchLayoutMode = useSetAtom(switchLayoutModeAtom);

  const openSettingModal = useSetAtom(openSettingModalAtom);
  const openMixerModal = useSetAtom(openMixerModalAtom);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      // 세로 1칸 / 2
      const area = (window.document.body.clientHeight / GRID_SIZE_HEIGHT) * 0.5;
      setMouseTop(event.clientY < area);
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

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setShow(isFullscreen === false);
  }, [isFullscreen]);

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

  const buttons = useMemo(() => {
    return [
      {
        key: "refresh",
        Icon: MdRefresh,
        text: "레이아웃 초기화",
        onClick: onClearButtonClick,
        filter: [LayoutMode.Modify],
      },
      {
        key: "fullscreen",
        Icon: isFullscreen ? MdFullscreenExit : MdFullscreen,
        text: isFullscreen ? "전체 화면 종료" : "전체 화면",
        onClick: toggleFullscreen,
        filter: [LayoutMode.Modify, LayoutMode.View],
      },
      {
        key: "mode",
        Icon: layoutMode === LayoutMode.View ? MdEdit : MdOndemandVideo,
        text: layoutMode === LayoutMode.View ? "편집 모드" : "시청 모드",
        onClick: onModeButtonClick,
        filter: [LayoutMode.Modify, LayoutMode.View],
      },
      {
        key: "mixer",
        Icon: MdVolumeUp,
        text: "스트림 믹서",
        onClick: openMixerModal,
        filter: [LayoutMode.Modify, LayoutMode.View],
      },
      {
        key: "setting",
        Icon: MdSettings,
        text: "설정",
        onClick: openSettingModal,
        filter: [LayoutMode.Modify, LayoutMode.View],
      },
      {
        key: "fold",
        Icon: isShow ? MdExpandLess : MdExpandMore,
        text: isShow ? "접기" : "펼치기",
        onClick: onFoldButtonClick,
        filter: [LayoutMode.Modify, LayoutMode.View],
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
  }, [isShow, layoutMode]);

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
