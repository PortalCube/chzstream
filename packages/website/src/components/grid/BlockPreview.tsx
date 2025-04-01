import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { previewBlockAtom } from "@web/librarys/app.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";

const Container = styled.div<{ $dpr: number }>`
  margin: ${(props) => 4 / props.$dpr + "px"};
  border-radius: 8px;

  user-select: none;
  -webkit-user-select: none;

  overflow: hidden;

  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 32px rgba(255, 255, 255, 0.1);

  transition-property: opacity, left, top, right, bottom;
  transition-duration: 100ms;
  transition-timing-function: ease-out;

  z-index: 1;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

function BlockPreview() {
  const previewBlock = useAtomValue(previewBlockAtom);
  const { status, position } = previewBlock;

  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);

  const style = useMemo(() => getGridStyle(position), [position]);
  const className = classNames({
    hidden: status !== "create",
  });

  return (
    <Container style={style} className={className} $dpr={displayPixelRatio} />
  );
}

export default BlockPreview;
