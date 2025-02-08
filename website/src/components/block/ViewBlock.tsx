import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useContext, useMemo } from "react";
import { layoutModeAtom } from "src/librarys/app.ts";
import { BlockType } from "src/librarys/block.ts";
import { BlockContext } from "src/librarys/context";
import { LayoutMode } from "src/librarys/layout.ts";
import { MessageClient } from "src/scripts/message.ts";
import { Mixin } from "src/scripts/styled.ts";
import styled, { css } from "styled-components";

const resizeMixin = (scale: number) => {
  const elementSize = 100 / scale;
  const translateValue = (elementSize - 100) / -2;

  return css`
    width: ${elementSize}%;
    height: ${elementSize}%;
    transform: scale(${scale}) translate(${translateValue}%, ${translateValue}%);
  `;
};

const Container = styled.iframe`
  width: 100%;
  height: 100%;
  flex-flow: wrap;

  container-type: size;
  container-name: block;

  background-color: #000000;

  &.modify-mode {
    display: none;
  }

  &.lock {
    /* pointer-events: none; */
  }

  &.loading {
    visibility: hidden;
    pointer-events: none;
  }

  &.chat {
    ${Mixin.block.less.small(css`
      ${resizeMixin(0.75)}
    `)}
  }
`;

function ViewBlock({ loaded }: ViewBlockProps) {
  const layoutMode = useAtomValue(layoutModeAtom);
  const { id, type, status, lock, channel } = useContext(BlockContext);

  const src = useMemo((): string => {
    // 채널 정보가 비어있는 블록
    if (channel === null) {
      return "about:blank";
    }

    // 아직 활성화되지 않음
    if (status === false) {
      return "about:blank";
    }

    switch (type) {
      case BlockType.Chat:
        return `https://chzzk.naver.com/live/${channel.uuid}/chat?embed=true&_csp=${MessageClient.id}&_csi=${id}`;
      case BlockType.Stream:
      default:
        return `https://chzzk.naver.com/live/${channel.uuid}?embed=true&_csp=${MessageClient.id}&_csi=${id}`;
    }
  }, [id, channel, status, type]);

  const className = classNames({
    loading: loaded === false,
    "modify-mode": layoutMode === LayoutMode.Modify,
    chat: type === BlockType.Chat,
    lock,
  });

  return (
    <Container
      className={className}
      src={src}
      scrolling="no"
      allowFullScreen
    ></Container>
  );
}

type ViewBlockProps = {
  loaded: boolean;
};

export default ViewBlock;
