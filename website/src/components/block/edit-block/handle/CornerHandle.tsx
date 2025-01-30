import { useAtom } from "jotai";
import { PreviewBlockHandle } from "src/librarys/block.ts";
import {
  previewBlockAtom,
  startModifyBlockPreview,
} from "src/librarys/grid-preview.ts";
import { findBlock } from "src/librarys/grid.ts";
import styled from "styled-components";

const Container = styled.div`
  width: 24px;
  height: 24px;

  padding: 4px;

  position: absolute;

  opacity: 0;
  transition: opacity 150ms;

  & > svg {
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.85));
  }

  &:hover {
    opacity: 0.75;
  }

  &.top-left {
    top: var(--block-margin-base);
    left: var(--block-margin-base);
    cursor: nwse-resize;
  }

  &.top-right {
    top: var(--block-margin-base);
    right: var(--block-margin-base);
    cursor: nesw-resize;
  }

  &.bottom-right {
    bottom: var(--block-margin-base);
    right: var(--block-margin-base);
    cursor: nwse-resize;
  }

  &.bottom-left {
    bottom: var(--block-margin-base);
    left: var(--block-margin-base);
    cursor: nesw-resize;
  }
`;

function TopLeftCornerHandle({
  size,
  radius,
  thickness,
  color,
}: SubCornerHandleProps) {
  const innerSize = size * radius;
  const halfThickness = thickness / 2;
  const circleSize = innerSize - halfThickness;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {/* Circle 커브 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        d={`M${halfThickness},${innerSize} a${innerSize},${innerSize} 0 0,1 ${circleSize},${-circleSize}`}
      ></path>
      {/* 왼쪽 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M ${halfThickness} ${innerSize} L ${halfThickness} ${size - halfThickness}`}
      ></path>
      {/* 상단 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M${innerSize} ${halfThickness} L ${size - halfThickness} ${halfThickness}`}
      ></path>
    </svg>
  );
}

function TopRightCornerHandle({
  size,
  radius,
  thickness,
  color,
}: SubCornerHandleProps) {
  const innerSize = size * radius;
  const halfThickness = thickness / 2;
  const circleSize = innerSize - halfThickness;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {/* Circle 커브 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        d={`M${size - innerSize},${halfThickness} a${innerSize},${innerSize} 0 0,1 ${circleSize},${circleSize}`}
      ></path>
      {/* 오른쪽 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M ${size - halfThickness} ${innerSize} L ${size - halfThickness} ${size - halfThickness}`}
      ></path>
      {/* 상단 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M${size - innerSize} ${halfThickness} L ${halfThickness} ${halfThickness}`}
      ></path>
    </svg>
  );
}

function BottomRightCornerHandle({
  size,
  radius,
  thickness,
  color,
}: SubCornerHandleProps) {
  const innerSize = size * radius;
  const halfThickness = thickness / 2;
  const circleSize = innerSize - halfThickness;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {/* Circle 커브 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        d={`M${size - halfThickness},${size - innerSize} a${innerSize},${innerSize} 0 0,1 ${-circleSize},${circleSize}`}
      ></path>
      {/* 오른쪽 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M ${size - halfThickness} ${size - innerSize} L ${size - halfThickness} ${halfThickness}`}
      ></path>
      {/* 하단 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M${size - innerSize} ${size - halfThickness} L ${halfThickness} ${size - halfThickness}`}
      ></path>
    </svg>
  );
}

function BottomLeftCornerHandle({
  size,
  radius,
  thickness,
  color,
}: SubCornerHandleProps) {
  const innerSize = size * radius;
  const halfThickness = thickness / 2;
  const circleSize = innerSize - halfThickness;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {/* Circle 커브 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        d={`M${innerSize},${size - halfThickness} a${innerSize},${innerSize} 0 0,1 ${-circleSize},${-circleSize}`}
      ></path>
      {/* 왼쪽 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M ${halfThickness} ${size - innerSize} L ${halfThickness} ${halfThickness}`}
      ></path>
      {/* 하단 선 */}
      <path
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        d={`M${innerSize} ${size - halfThickness} L ${size - halfThickness} ${size - halfThickness}`}
      ></path>
    </svg>
  );
}

function getCompoenent(direction: PreviewBlockHandle | null) {
  switch (direction) {
    case PreviewBlockHandle.TopLeft:
      return TopLeftCornerHandle;
    case PreviewBlockHandle.TopRight:
      return TopRightCornerHandle;
    case PreviewBlockHandle.BottomRight:
      return BottomRightCornerHandle;
    case PreviewBlockHandle.BottomLeft:
      return BottomLeftCornerHandle;
    default:
      return TopLeftCornerHandle;
  }
}

function CornerHandle({ id, direction }: CornerHandleProps) {
  const block = findBlock(id);
  const [blockPreview, setBlockPreview] = useAtom(previewBlockAtom);
  const Component = getCompoenent(direction);

  const onPointerDown: React.PointerEventHandler = () => {
    if (block.id === -1) {
      return;
    }

    setBlockPreview(startModifyBlockPreview(block, direction));
  };

  return (
    <Container className={direction!} onPointerDown={onPointerDown}>
      <Component size={24} radius={0.33} thickness={4} color="#ffffff" />
    </Container>
  );
}

type CornerHandleProps = {
  id: number;
  direction: PreviewBlockHandle;
};

type SubCornerHandleProps = {
  size: number;
  radius: number;
  thickness: number;
  color: string;
};

export default CornerHandle;
