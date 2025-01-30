import classNames from "classnames";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import {
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdOndemandVideo,
  MdRefresh,
  MdSettings,
  MdZoomInMap,
  MdZoomOutMap,
} from "react-icons/md";
import { isFullscreenAtom } from "src/hooks/useFullscreenDetect.tsx";
import {
  activateBlockStatus,
  ApplicationMode,
  applicationModeAtom,
  blockListAtom,
  mouseIsTopAtom,
} from "src/librarys/grid.ts";
import { GRID_SIZE_HEIGHT } from "src/scripts/constants.ts";
import styled, { css } from "styled-components";
import ChannelGroup from "./ChannelGroup.tsx";
import MenuButton from "./MenuButton.tsx";

import LogoImage from "src/assets/logo.png";
import { modalAtom, ModalType, useModal } from "src/librarys/modal.ts";
import {
  extraLargeScreenMixin,
  largeScreenMixin,
  mediumScreenMixin,
  smallScreenMixin,
} from "src/scripts/styled.ts";

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

  --height: 40px;

  ${largeScreenMixin(css`
    --height: 70px;
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
  height: 28px;
  object-fit: contain;
`;

const MenuGroup = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function Topbar() {
  const [mode, setMode] = useAtom(applicationModeAtom);
  const [isFullscreen, setFullscreen] = useAtom(isFullscreenAtom);
  const [blockList, setBlockList] = useAtom(blockListAtom);
  const [isShow, setShow] = useState(true);
  const [mouseIsTop, setMouseTop] = useAtom(mouseIsTopAtom);
  const { openSettingModal } = useModal();

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
      setBlockList([]);
    }
  };

  const onFoldButtonClick: React.MouseEventHandler = () => {
    setShow((prev) => !prev);

    if (isShow) {
      setMouseTop(false);
    }
  };

  const onModeButtonClick: React.MouseEventHandler = () => {
    if (mode === ApplicationMode.View) {
      setMode(ApplicationMode.Modify);
    } else if (mode === ApplicationMode.Modify) {
      setMode(ApplicationMode.View);
      setBlockList(activateBlockStatus());
    }
  };

  const buttons = [
    {
      key: "refresh",
      Icon: MdRefresh,
      text: "초기화",
      onClick: onClearButtonClick,
      filter: [ApplicationMode.Modify],
    },
    {
      key: "fold",
      Icon: isShow ? MdExpandLess : MdExpandMore,
      text: isShow ? "접기" : "펼치기",
      onClick: onFoldButtonClick,
      filter: [ApplicationMode.Modify, ApplicationMode.View],
    },
    {
      key: "fullscreen",
      Icon: isFullscreen ? MdZoomInMap : MdZoomOutMap,
      text: isFullscreen ? "전체 화면 종료" : "전체 화면",
      onClick: toggleFullscreen,
      filter: [ApplicationMode.Modify, ApplicationMode.View],
    },
    {
      key: "mode",
      Icon: mode === ApplicationMode.View ? MdEdit : MdOndemandVideo,
      text: mode === ApplicationMode.View ? "편집 모드" : "시청 모드",
      onClick: onModeButtonClick,
      filter: [ApplicationMode.Modify, ApplicationMode.View],
    },
    {
      key: "setting",
      Icon: MdSettings,
      text: "설정",
      onClick: openSettingModal,
      filter: [ApplicationMode.Modify, ApplicationMode.View],
    },
  ];

  const buttonElements = useMemo(() => {
    return buttons
      .filter((item) => item.filter.includes(mode))
      .map((item) => {
        return (
          <MenuButton
            key={item.key}
            Icon={item.Icon}
            text={item.text}
            onClick={item.onClick}
          />
        );
      });
  }, [mode, isShow]);

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
      <MenuGroup>{buttonElements}</MenuGroup>
    </Container>
  );
}

export default Topbar;
