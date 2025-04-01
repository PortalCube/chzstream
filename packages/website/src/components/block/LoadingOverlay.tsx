import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";

import Spinner from "@web/components/block/Spinner.tsx";
import { layoutModeAtom } from "@web/librarys/app.ts";
import { BlockContext } from "@web/librarys/context.ts";

const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const spinnerBackgroundAnimation = keyframes`
    0% {
      background-position-x: -15%;
    }
    50% {
      background-position-x: 115%;
    }
    100% {
      background-position-x: -15%;
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
  animation-duration: 4000ms;
  animation-delay: ${(props) => props.$delay}ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;

  opacity: 1;

  &.hidden {
    display: none;
  }

  &.disable {
    opacity: 0;
    pointer-events: none;
  }
`;

function LoadingOverlay({}: LoadingOverlayProps) {
  const block = useContext(BlockContext);
  const layoutMode = useAtomValue(layoutModeAtom);

  const [delay] = useState(randomRange(-2000, 0));

  const className = classNames({
    hidden: layoutMode === "modify",
    disable: block.status.loading === false,
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

type LoadingOverlayProps = {};

export default LoadingOverlay;
