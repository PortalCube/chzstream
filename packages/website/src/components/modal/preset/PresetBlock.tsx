import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { BlockPosition, BlockType } from "@web/librarys/block.ts";
import { getGridStyle } from "@web/scripts/grid-layout.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { MdForum } from "react-icons/md";
import styled from "styled-components";

const Container = styled.div<{ $dpr: number }>`
  margin: ${(props) => 3 / props.$dpr + "px"};
  border-radius: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(53, 53, 53);

  overflow: hidden;

  &.chat {
    background-color: rgb(70, 70, 70);
    color: rgb(191, 191, 191);
  }
`;

function PresetBlock({ position, type }: PresetBlockProps) {
  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);

  const className = classNames({
    chat: type === "chat",
    stream: type === "stream",
  });
  const style = getGridStyle(position);

  const chatIcon = type === "chat" ? <MdForum size={12} /> : null;

  return (
    <Container className={className} $dpr={displayPixelRatio} style={style}>
      {chatIcon}
    </Container>
  );
}

type PresetBlockProps = {
  position: BlockPosition;
  type: BlockType;
};

export default PresetBlock;
