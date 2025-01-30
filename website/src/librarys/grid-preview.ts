// Grid Preview Context

import { atomWithImmer } from "jotai-immer";
import {
  Block,
  BlockPosition,
  PreviewBlock,
  PreviewBlockHandle,
  PreviewBlockStatus,
} from "./block.ts";
import { MIN_BLOCK_HEIGHT, MIN_BLOCK_WIDTH } from "src/scripts/constants.ts";

export const previewBlockAtom = atomWithImmer<PreviewBlock>({
  status: PreviewBlockStatus.Inactive,
  position: {
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  },
  linkedBlockId: null,
  handle: null,
});

export function startCreateBlockPreview(
  x: number,
  y: number,
  blockList: Block[]
) {
  return (draft: PreviewBlock) => {
    const position: BlockPosition = {
      top: y,
      left: x,
      width: 1,
      height: 1,
    };

    if (hasBlockCollision(position, blockList, null)) {
      return;
    }

    draft.status = PreviewBlockStatus.Create;
    draft.position = position;
    draft.linkedBlockId = null;
    draft.handle = null;
  };
}

export function moveCreateBlockPreview(
  x: number,
  y: number,
  blockList: Block[]
) {
  return (draft: PreviewBlock) => {
    const position = {
      top: draft.position.top,
      left: draft.position.left,
      width: x - draft.position.left + 1,
      height: y - draft.position.top + 1,
    };

    if (position.width <= 0) {
      position.left = position.left + position.width - 1;
      position.width = 2 - position.width;
    }

    if (position.height <= 0) {
      position.top = position.top + position.height - 1;
      position.height = 2 - position.height;
    }

    if (hasBlockCollision(position, blockList, null)) {
      return;
    }

    draft.position.width = x - draft.position.left + 1;
    draft.position.height = y - draft.position.top + 1;
  };
}

export function endCreateBlockPreview() {
  return (draft: PreviewBlock) => {
    draft.status = PreviewBlockStatus.Inactive;
    draft.linkedBlockId = null;
    draft.handle = null;
  };
}

export function startModifyBlockPreview(
  block: Block,
  handle: PreviewBlockHandle
) {
  return (draft: PreviewBlock) => {
    draft.status = PreviewBlockStatus.Modify;
    draft.position = {
      top: block.position.top,
      left: block.position.left,
      width: block.position.width,
      height: block.position.height,
    };
    draft.linkedBlockId = block.id;
    draft.handle = handle;
  };
}

export function moveModifyBlockPreview(
  x: number,
  y: number,
  currentId: number | null,
  blockList: Block[]
) {
  return (draft: PreviewBlock) => {
    let top = draft.position.top;
    let left = draft.position.left;
    let width = draft.position.width;
    let height = draft.position.height;
    const position: BlockPosition = { top, left, width, height };

    const moveLeft = () => {
      if (x < left + width) {
        position.width += left - x;
        position.left = x;
      }
    };

    const moveTop = () => {
      if (y < top + height) {
        position.height += top - y;
        position.top = y;
      }
    };

    const moveRight = () => {
      if (left <= x) {
        position.width = x - left + 1;
      }
    };

    const moveBottom = () => {
      if (top <= y) {
        position.height = y - top + 1;
      }
    };

    // 핸들 방향에 따라서 좌표 값 갱신
    switch (draft.handle) {
      case PreviewBlockHandle.TopLeft:
        moveLeft();
        moveTop();
        break;
      case PreviewBlockHandle.Top:
        moveTop();
        break;
      case PreviewBlockHandle.TopRight:
        moveTop();
        moveRight();
        break;
      case PreviewBlockHandle.Left:
        moveLeft();
        break;
      case PreviewBlockHandle.Right:
        moveRight();
        break;
      case PreviewBlockHandle.BottomLeft:
        moveLeft();
        moveBottom();
        break;
      case PreviewBlockHandle.Bottom:
        moveBottom();
        break;
      case PreviewBlockHandle.BottomRight:
        moveBottom();
        moveRight();
        break;
    }

    // Test 1: 최소 크기 제한
    if (position.width < MIN_BLOCK_WIDTH) {
      return;
    }

    if (position.height < MIN_BLOCK_HEIGHT) {
      return;
    }

    // Test 2: 블록 간 충돌 체크
    if (hasBlockCollision(position, blockList, currentId)) {
      return;
    }

    // 새로운 좌표를 적용
    draft.position = position;
  };
}

function hasBlockCollision(
  position: BlockPosition,
  blockList: Block[],
  currentId: number | null
) {
  const top = position.top;
  const left = position.left;
  const width = position.width;
  const height = position.height;
  const right = left + width - 1;
  const bottom = top + height - 1;

  for (const block of blockList) {
    if (block.id === currentId) {
      continue;
    }

    const blockLeft = block.position.left;
    const blockRight = block.position.left + block.position.width - 1;
    const blockTop = block.position.top;
    const blockBottom = block.position.top + block.position.height - 1;

    // 1. 블록 꼭지점이 다른 블록 내부로 들어가는지 확인
    const points: [BlockPosition, number, number][] = [
      [position, blockLeft, blockTop],
      [position, blockRight, blockTop],
      [position, blockLeft, blockBottom],
      [position, blockRight, blockBottom],
      // [block.position, left, top],
      // [block.position, right, top],
      // [block.position, left, bottom],
      // [block.position, right, bottom],
    ];

    for (const [position, x, y] of points) {
      const left = position.left;
      const right = position.left + position.width - 1;
      const top = position.top;
      const bottom = position.top + position.height - 1;

      if (left <= x && x <= right && top <= y && y <= bottom) {
        return true;
      }
    }

    // 2. 블록에 교점이 있는지 확인
    if (blockLeft <= left && left <= blockRight) {
      if (top <= blockTop && blockTop <= bottom) {
        return true;
      }

      if (top <= blockBottom && blockBottom <= bottom) {
        return true;
      }
    }

    if (blockLeft <= right && right <= blockRight) {
      if (top <= blockTop && blockTop <= bottom) {
        return true;
      }

      if (top <= blockBottom && blockBottom <= bottom) {
        return true;
      }
    }

    if (blockTop <= top && top <= blockBottom) {
      if (left <= blockLeft && blockLeft <= right) {
        return true;
      }

      if (left <= blockRight && blockRight <= right) {
        return true;
      }
    }

    if (blockTop <= bottom && bottom <= blockBottom) {
      if (left <= blockLeft && blockLeft <= right) {
        return true;
      }

      if (left <= blockRight && blockRight <= right) {
        return true;
      }
    }
  }

  return false;
}
