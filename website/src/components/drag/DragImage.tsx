import { useAtom } from "jotai";
import { useEffect } from "react";
import { displayPixelRatioAtom } from "src/hooks/useDisplayPixelRatio.tsx";
import styled, { css } from "styled-components";

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

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.p<{ $dpr: number }>`
  font-size: ${ratioMixin(16)};
  font-weight: 300;
  color: rgb(200, 200, 200);
`;

// Note: Windows에서는 DragImage가 300x300을 초과하면 방사형 투명도 그라데이션이 적용됨

function DragImage({ _ref, src, name }: DragImageProps) {
  const [displayPixelRatio] = useAtom(displayPixelRatioAtom);

  return (
    <Container ref={_ref} $dpr={displayPixelRatio}>
      <Image src={src} $dpr={displayPixelRatio} />
      <Info $dpr={displayPixelRatio}>
        <Name $dpr={displayPixelRatio}>{name}</Name>
        <Description $dpr={displayPixelRatio}>
          원하는 블록에 드롭하세요!
        </Description>
      </Info>
    </Container>
  );
}

type DragImageProps = {
  _ref: React.RefObject<HTMLDivElement>;
  src: string;
  name: string;
};

export default DragImage;
