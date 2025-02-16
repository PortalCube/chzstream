import classNames from "classnames";
import { useSetAtom } from "jotai";
import { useContext } from "react";
import { PreviewBlockHandle } from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context";
import { beginModifyPreviewAtom } from "@web/librarys/layout-preview.ts";
import styled from "styled-components";

const Container = styled.div`
  padding: 4px;

  position: absolute;

  opacity: 0;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.75;
  }

  &.vertical {
    top: 0;
    bottom: 0;
    max-height: 50%;
    margin: auto 0;
  }

  &.horizontal {
    left: 0;
    right: 0;
    max-width: 50%;
    margin: 0 auto;
  }

  &.top {
    top: var(--block-margin-base);
    cursor: ns-resize;
  }

  &.right {
    right: var(--block-margin-base);
    cursor: ew-resize;
  }

  &.bottom {
    bottom: var(--block-margin-base);
    cursor: ns-resize;
  }

  &.left {
    left: var(--block-margin-base);
    cursor: ew-resize;
  }
`;

const Line = styled.div`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.5);

  &.vertical {
    width: 4px;
    height: 100%;
  }

  &.horizontal {
    width: 100%;
    height: 4px;
  }
`;

function getLineClass(direction: PreviewBlockHandle) {
  switch (direction) {
    case PreviewBlockHandle.Top:
      return "horizontal";
    case PreviewBlockHandle.Right:
      return "vertical";
    case PreviewBlockHandle.Bottom:
      return "horizontal";
    case PreviewBlockHandle.Left:
      return "vertical";
    default:
      return "horizontal";
  }
}

function LineHandle({ direction }: LineHandleProps) {
  const block = useContext(BlockContext);
  const beginModifyPreview = useSetAtom(beginModifyPreviewAtom);

  const onPointerDown: React.PointerEventHandler = () => {
    beginModifyPreview(block, direction);
  };

  const lineClass = getLineClass(direction);
  const className = classNames([direction, lineClass]);

  return (
    <Container className={className} onPointerDown={onPointerDown}>
      <Line className={lineClass} />
    </Container>
  );
}

type LineHandleProps = {
  direction: PreviewBlockHandle;
};

export default LineHandle;
