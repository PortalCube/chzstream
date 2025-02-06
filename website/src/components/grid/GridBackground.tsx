import { useAtom } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import { displayPixelRatioAtom } from "src/hooks/useDisplayPixelRatio.tsx";
import { GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH } from "src/scripts/constants.ts";
import {
  LayoutMode,
  layoutModeAtom,
  nextBlockIdAtom,
} from "src/librarys/layout.ts";
import classNames from "classnames";

import LogoImage from "src/assets/logo.png";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: grid;

  grid-area: 1 / 1 / -1 / -1;

  user-select: none;
  -webkit-user-select: none;

  pointer-events: none;

  transition: opacity 200ms;

  &.view-mode {
    opacity: 0;
  }
`;

const WelcomeMessage = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 16px;

  text-align: center;

  color: rgba(255, 255, 255, 0.25);

  opacity: 0;

  transition: opacity 200ms;

  &.show {
    opacity: 1;
  }
`;

const WelcomeLogo = styled.img`
  height: 48px;
  object-fit: contain;

  filter: saturate(0) contrast(0.6) brightness(0.35);
`;

const WelcomeDescription = styled.p`
  font-size: 20px;
  font-weight: 300;

  line-height: 28px;

  text-wrap: balance;
`;

const RowLineGroup = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const ColumnLineGroup = styled.div`
  grid-row-start: 1;
  grid-column-start: 1;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const RowLine = styled.div<{ $isSub: boolean; $dpr: number }>`
  width: 100%;
  height: ${(props) => 2 / props.$dpr + "px"};
  background-color: rgba(
    255,
    255,
    255,
    ${(props) => (props.$isSub ? "0.05" : "0.02")}
  );
  flex-shrink: 0;
`;

const ColumnLine = styled.div<{ $isSub: boolean; $dpr: number }>`
  height: 100%;
  width: ${(props) => 2 / props.$dpr + "px"};
  background-color: rgba(
    255,
    255,
    255,
    ${(props) => (props.$isSub ? "0.05" : "0.02")}
  );

  flex-shrink: 0;
`;

function GridBackground({
  width = GRID_SIZE_WIDTH,
  height = GRID_SIZE_HEIGHT,
  subWidth = 4,
  subHeight = 4,
}: GridBackgroundProps) {
  const [displayPixelRatio] = useAtom(displayPixelRatioAtom);

  const [mode, setMode] = useAtom(layoutModeAtom);

  const [blockId, setBlockId] = useAtom(nextBlockIdAtom);

  const rowLines = useMemo(() => {
    const rowLines = [];

    for (let i = 0; i < height - 1; i++) {
      rowLines.push(
        <RowLine
          key={i}
          $dpr={displayPixelRatio}
          $isSub={(i + 1) % subHeight === 0}
        />
      );
    }

    return rowLines;
  }, [displayPixelRatio, height, subHeight]);

  const columnLines = useMemo(() => {
    const columnLines = [];

    for (let i = 0; i < width - 1; i++) {
      columnLines.push(
        <ColumnLine
          key={i}
          $dpr={displayPixelRatio}
          $isSub={(i + 1) % subWidth === 0}
        />
      );
    }

    return columnLines;
  }, [displayPixelRatio, width, subWidth]);

  const className = classNames({ "view-mode": mode === LayoutMode.View });
  const welcomeClassName = classNames({ show: blockId === 1 });

  return (
    <Container className={className}>
      <WelcomeMessage className={welcomeClassName}>
        <WelcomeLogo src={LogoImage} alt="chzstream" />
        <WelcomeDescription>
          치즈스트림에 오신 것을 환영합니다. <br />
          사용법을 보시려면 상단의 도움말을 눌러주세요.
        </WelcomeDescription>
      </WelcomeMessage>
      <RowLineGroup>{rowLines}</RowLineGroup>
      <ColumnLineGroup>{columnLines}</ColumnLineGroup>
    </Container>
  );
}

type GridBackgroundProps = {
  width?: number;
  height?: number;
  subWidth?: number;
  subHeight?: number;
};

export default GridBackground;
