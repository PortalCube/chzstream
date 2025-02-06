import classNames from "classnames";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { displayPixelRatioAtom } from "src/hooks/useDisplayPixelRatio.tsx";
import { PreviewBlockStatus } from "src/librarys/block.ts";
import { layoutSizeAtom } from "src/librarys/layout.ts";
import { previewBlockAtom } from "src/librarys/layout-preview.ts";
import { getGridStyle } from "src/scripts/grid-layout.ts";
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
  const [previewBlock] = useAtom(previewBlockAtom);
  const [[gridWidth, gridHeight]] = useAtom(layoutSizeAtom);
  const { status, position } = previewBlock;

  const [displayPixelRatio] = useAtom(displayPixelRatioAtom);

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
