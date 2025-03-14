import { BlockPosition } from "@web/librarys/block.ts";
import { GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH } from "@web/scripts/constants.ts";

export function getGridStyle(
  position: BlockPosition | null
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

  const right = GRID_SIZE_WIDTH - left - width;
  const bottom = GRID_SIZE_HEIGHT - top - height;

  // left, top, right, bottom을 계산
  return {
    position: "absolute",
    left: (left / GRID_SIZE_WIDTH) * 100 + "%",
    top: (top / GRID_SIZE_HEIGHT) * 100 + "%",
    right: (right / GRID_SIZE_WIDTH) * 100 + "%",
    bottom: (bottom / GRID_SIZE_HEIGHT) * 100 + "%",
  };
}
