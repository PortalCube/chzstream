import { BlockPosition } from "src/librarys/block.ts";
import { GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH } from "./constants.ts";

export function getGridStyle(
  position: BlockPosition | null,
  gridWidth: number,
  gridHeight: number
): React.CSSProperties {
  if (position === null) {
    return {};
  }

  // width, height, transform 반환하기

  // const width = (gridWidth / GRID_SIZE_WIDTH) * position.width;
  // const height = (gridHeight / GRID_SIZE_HEIGHT) * position.height;
  // const left = (gridWidth / GRID_SIZE_WIDTH) * position.left;
  // const top = (gridHeight / GRID_SIZE_HEIGHT) * position.top;

  // return {
  //   width: `${width}px`,
  //   height: `${height}px`,
  //   transform: `translate(${left}px, ${top}px)`,
  // };

  let gridColumnStart = position.left + 1;
  let gridColumnEnd = position.left + position.width + 1;
  let gridRowStart = position.top + 1;
  let gridRowEnd = position.top + position.height + 1;

  if (position.width <= 0) {
    gridColumnStart = position.left + position.width;
    gridColumnEnd = position.left + 2;
  }

  if (position.height <= 0) {
    gridRowStart = position.top + position.height;
    gridRowEnd = position.top + 2;
  }

  return {
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
  };
}
