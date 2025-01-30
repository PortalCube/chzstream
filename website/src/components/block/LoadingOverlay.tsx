import classNames from "classnames";
import { useAtom } from "jotai";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { ApplicationMode, applicationModeAtom } from "src/librarys/grid.ts";

import { displayPixelRatioAtom } from "src/hooks/useDisplayPixelRatio.tsx";
import Spinner from "./Spinner.tsx";

const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const spinnerBackgroundAnimation = keyframes`
    0% {
      background-position-x: -15%;
      box-shadow: inset 0px 0px 32px rgba(255, 255, 255, 0.05);
    }
    100% {
      background-position-x: 115%;
      box-shadow: inset 0px 0px 48px rgba(255, 255, 255, 0.1);
    }
`;

const Container = styled.div<{ $delay: number }>`
  overflow: hidden;

  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 32px;

  transition: opacity 100ms;

  color: rgb(150, 150, 150);
  background: linear-gradient(
    90deg,
    rgba(20, 20, 20, 1) 30%,
    rgba(26, 26, 26, 1) 50%,
    rgba(20, 20, 20, 1) 70%
  );
  background-size: 200% 100%;

  animation-name: ${spinnerBackgroundAnimation};
  animation-fill-mode: both;
  animation-duration: 1800ms;
  animation-delay: ${(props) => props.$delay}ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;

  &.hidden {
    display: none;
  }

  &.load {
    opacity: 0;
    pointer-events: none;
  }
`;

function LoadingOverlay({ id, loaded }: LoadingOverlayProps) {
  const [mode, setMode] = useAtom(applicationModeAtom);

  const [delay] = useState(randomRange(-2000, 0));

  const className = classNames({
    hidden: mode === ApplicationMode.Modify,
    load: loaded,
  });

  const onDragEnter: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  const onDragOver: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      className={className}
      $delay={delay}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
    >
      <Spinner />
      불러오는 중...
    </Container>
  );
}

type LoadingOverlayProps = {
  id: number;
  loaded: boolean;
};

export default LoadingOverlay;
