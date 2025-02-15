import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { layoutSizeAtom, previewBlockAtom } from "@web/librarys/app.ts";
import { PreviewBlockStatus } from "@web/librarys/block.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import styled from "styled-components";

const Container = styled.div<{ $dpr: number }>`
  margin: ${(props) => 4 / props.$dpr + "px"};
  border-radius: 8px;

  user-select: none;
  -webkit-user-select: none;

  overflow: hidden;

  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 32px rgba(255, 255, 255, 0.1);

  transition: opacity 100ms;

  z-index: 1;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

function BlockPreview() {
  const previewBlock = useAtomValue(previewBlockAtom);
  const [gridWidth, gridHeight] = useAtomValue(layoutSizeAtom);
  const { status, position } = previewBlock;

  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);

  const style = useMemo(
    () => getGridStyle(position, gridWidth, gridHeight),
    [position, gridWidth, gridHeight]
  );
  const className = classNames({
    hidden: status !== PreviewBlockStatus.Create,
  });

  return (
    <Container style={style} className={className} $dpr={displayPixelRatio} />
  );
}

export default BlockPreview;
