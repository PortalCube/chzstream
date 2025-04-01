import { blockListAtom, previewBlockAtom } from "@web/librarys/app.ts";
import {
  Block,
  BlockPosition,
  PreviewBlockHandle,
} from "@web/librarys/block.ts";
import { MIN_BLOCK_HEIGHT, MIN_BLOCK_WIDTH } from "@web/scripts/constants.ts";
import { atom } from "jotai";

export const beginPreviewAtom = atom(null, (get, set, x: number, y: number) => {
  const blockList = get(blockListAtom);

  const position: BlockPosition = {
    top: y,
    left: x,
    width: 1,
    height: 1,
  };

  if (hasBlockCollision(position, blockList, null)) {
    return;
  }

  set(previewBlockAtom, (prev) => {
    prev.status = "create";
    prev.position = position;
    prev.linkedBlockId = null;
    prev.handle = null;
  });
});

export const movePreviewAtom = atom(null, (get, set, x: number, y: number) => {
  const blockList = get(blockListAtom);
  const previewBlock = get(previewBlockAtom);

  if (previewBlock.position === null) return;

  const position = {
    top: previewBlock.position.top,
    left: previewBlock.position.left,
    width: x - previewBlock.position.left + 1,
    height: y - previewBlock.position.top + 1,
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

  set(previewBlockAtom, (prev) => {
    if (prev.position === null) return;
    prev.position.width = x - prev.position.left + 1;
    prev.position.height = y - prev.position.top + 1;
  });
});

export const endPreviewAtom = atom(null, (_get, set) => {
  set(previewBlockAtom, (prev) => {
    prev.status = "inactive";
    prev.position = null;
    prev.linkedBlockId = null;
    prev.handle = null;
  });
});

export const beginModifyPreviewAtom = atom(
  null,
  (_get, set, block: Block, handle: PreviewBlockHandle) => {
    set(previewBlockAtom, (prev) => {
      prev.status = "modify";
      prev.position = {
        top: block.position.top,
        left: block.position.left,
        width: block.position.width,
        height: block.position.height,
      };
      prev.linkedBlockId = block.id;
      prev.handle = handle;
    });
  }
);

export const moveModifyPreviewAtom = atom(
  null,
  (get, set, x: number, y: number) => {
    const blockList = get(blockListAtom);
    const previewBlock = get(previewBlockAtom);

    if (previewBlock.handle === null) return;
    if (previewBlock.position === null) return;

    const position = structuredClone(previewBlock.position);
    const top = position.top;
    const left = position.left;
    const width = position.width;
    const height = position.height;

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

    const functions = {
      ["top-left"]: [moveLeft, moveTop],
      ["top"]: [moveTop],
      ["top-right"]: [moveTop, moveRight],
      ["left"]: [moveLeft],
      ["right"]: [moveRight],
      ["bottom-left"]: [moveLeft, moveBottom],
      ["bottom"]: [moveBottom],
      ["bottom-right"]: [moveBottom, moveRight],
    };

    functions[previewBlock.handle].forEach((func) => func());

    if (position.width < MIN_BLOCK_WIDTH) {
      return;
    }

    if (position.height < MIN_BLOCK_HEIGHT) {
      return;
    }

    if (hasBlockCollision(position, blockList, previewBlock.linkedBlockId)) {
      return;
    }

    set(previewBlockAtom, (prev) => {
      prev.position = position;
    });
  }
);

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
