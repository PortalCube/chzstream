import { BlockPosition } from "@web/librarys/block.ts";
import { GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH } from "@web/scripts/constants.ts";

export function getGridStyle(
  position: BlockPosition | null,
  gridWidth: number,
  gridHeight: number
): React.CSSProperties {
  if (position === null) {
    return {};
  }

  let { width, height, left, top } = position;

  // 음수 값을 갖는 길이를 보정
  if (width <= 0) {
    left = left + width - 1;
    width = 2 - width;
  }

  if (height <= 0) {
    top = top + height - 1;
    height = 2 - height;
  }

  // left, top, right, bottom을 계산
  width = (gridWidth / GRID_SIZE_WIDTH) * width;
  height = (gridHeight / GRID_SIZE_HEIGHT) * height;
  left = (gridWidth / GRID_SIZE_WIDTH) * left;
  top = (gridHeight / GRID_SIZE_HEIGHT) * top;
  const right = gridWidth - left - width;
  const bottom = gridHeight - top - height;

  return {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    right: `${right}px`,
    bottom: `${bottom}px`,
  };
}
