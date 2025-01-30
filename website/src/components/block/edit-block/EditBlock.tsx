import classNames from "classnames";
import { useAtom } from "jotai";
import { MdClose } from "react-icons/md";
import { displayPixelRatioAtom } from "src/hooks/useDisplayPixelRatio.tsx";
import {
  ApplicationMode,
  applicationModeAtom,
  blockListAtom,
  findBlock,
  removeBlock,
} from "src/librarys/grid.ts";
import {
  extraLargeBlockMixin,
  extraSmallBlockMixin,
  largeBlockMixin,
  mediumBlockMixin,
  smallBlockMixin,
} from "src/scripts/styled.ts";
import styled, { css } from "styled-components";
import Background from "./Background.tsx";
import Channel from "./Channel.tsx";
import TypeButton from "./TypeButton.tsx";
import Handle from "./handle/Handle.tsx";

const Container = styled.div<{ $dpr: number }>`
  /* margin: ${(props) => 4 / props.$dpr + "px"}; */
  --block-margin-base: 4px;
  border-radius: 8px;
  padding: 16px;

  ${extraLargeBlockMixin(css`
    --block-margin: calc(16px + var(--block-margin-base));
  `)}

  ${largeBlockMixin(css`
    --block-margin: calc(16px + var(--block-margin-base));
  `)}

  ${mediumBlockMixin(css`
    --block-margin: calc(12px + var(--block-margin-base));
  `)}

  ${smallBlockMixin(css`
    --block-margin: calc(12px + var(--block-margin-base));
  `)}

  ${extraSmallBlockMixin(css`
    --block-margin: calc(12px + var(--block-margin-base));
  `)}

  text-align: center;
  color: #ffffff;

  flex-flow: wrap;

  overflow: hidden;
  box-sizing: border-box;

  &.selected {
    opacity: 0.33;
  }

  &.view-mode {
    display: none;
  }
`;

const IconGroup = styled.div`
  position: absolute;

  transition:
    top 100ms,
    left 100ms,
    right 100ms;

  top: var(--block-margin);
  left: var(--block-margin);
  right: var(--block-margin);

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
`;

const RemoveButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 1);
  cursor: pointer;

  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  background-color: rgb(207, 58, 61);

  transition: background-color 100ms;
  &:hover {
    background-color: rgb(234, 72, 75);
  }

  & > svg {
    transition:
      width 100ms,
      height 100ms;

    ${extraLargeBlockMixin(css`
      width: 24px;
      height: 24px;
    `)}

    ${largeBlockMixin(css`
      width: 24px;
      height: 24px;
    `)}

    ${mediumBlockMixin(css`
      width: 20px;
      height: 20px;
    `)}

    ${smallBlockMixin(css`
      width: 20px;
      height: 20px;
    `)}

    ${extraSmallBlockMixin(css`
      width: 16px;
      height: 16px;
    `)}
  }
`;

function EditBlock({ id }: EditBlockProps) {
  const [mode, setMode] = useAtom(applicationModeAtom);
  const [_, setBlockList] = useAtom(blockListAtom);
  const { channel, type } = findBlock(id);

  const [displayPixelRatio] = useAtom(displayPixelRatioAtom);

  const className = classNames({ "view-mode": mode === ApplicationMode.View });

  const onRemoveClick = () => {
    setBlockList(removeBlock(id));
  };

  return (
    <Container className={className} $dpr={displayPixelRatio}>
      <Background id={id} />
      <Handle id={id} />
      <IconGroup>
        <TypeButton id={id} type={type} />
        <RemoveButton onClick={onRemoveClick}>
          <MdClose />
        </RemoveButton>
      </IconGroup>
      <Channel id={id} channel={channel} />
    </Container>
  );
}
type EditBlockProps = {
  id: number;
};

export default EditBlock;
