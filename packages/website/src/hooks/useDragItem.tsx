import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { Block, BlockChannel, BlockPlatform } from "@web/librarys/block.ts";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

const ratioMixin = (value: number) => {
  return ({ $dpr }: { $dpr: number }) => {
    return `calc(${value}px / ${$dpr})`;
  };
};

const Container = styled.div<{ $dpr: number }>`
  position: fixed;
  top: -10000px;
  left: -10000px;

  max-width: ${ratioMixin(300 - 16)};

  padding: ${ratioMixin(8)};
  border-radius: ${ratioMixin(4)};
  box-sizing: border-box;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${ratioMixin(12)};

  background-color: rgba(16, 16, 16, 1);
`;

const Image = styled.img<{ $dpr: number }>`
  flex-shrink: 0;
  width: ${ratioMixin(48)};
  height: ${ratioMixin(48)};
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  background-color: rgba(32, 32, 32, 1);
`;

const Info = styled.div<{ $dpr: number }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${ratioMixin(4)};

  overflow: hidden;
`;

const Name = styled.p<{ $dpr: number }>`
  max-width: 100%;
  font-size: ${ratioMixin(20)};
  font-weight: 700;
  color: rgb(255, 255, 255);

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.p<{ $dpr: number }>`
  font-size: ${ratioMixin(16)};
  font-weight: 300;
  color: rgb(200, 200, 200);
`;

export type DragItem = {
  _isChzstreamDragItem: true;
  block: number | null;
  platform: BlockPlatform; // TODO
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  liveId: string | null;
};

// Note: Windows에서는 DragImage가 300x300을 초과하면 방사형 투명도 그라데이션이 적용됨

export function useDragItem(
  blockId: number | null,
  channel: BlockChannel | null
): [React.ReactNode, DragItem, HTMLDivElement | null] {
  const ref = useRef<HTMLDivElement>(null);
  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);

  const dragItem: DragItem = useMemo(
    () => ({
      _isChzstreamDragItem: true,
      block: blockId,
      platform: channel?.platform ?? "chzzk",
      channelId: channel?.channelId ?? "",
      channelName: channel?.channelName ?? "채널 없음",
      channelImageUrl: channel?.channelImageUrl ?? getProfileImageUrl(),
      liveId: channel?.liveId ?? null,
    }),
    [blockId, channel]
  );

  const dragElement = (
    <Container ref={ref} $dpr={displayPixelRatio}>
      <Image src={dragItem.channelImageUrl} $dpr={displayPixelRatio} />
      <Info $dpr={displayPixelRatio}>
        <Name $dpr={displayPixelRatio}>{dragItem.channelName}</Name>
        <Description $dpr={displayPixelRatio}>
          원하는 블록에 드롭하세요!
        </Description>
      </Info>
    </Container>
  );

  return [dragElement, dragItem, ref.current];
}
