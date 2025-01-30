import classNames from "classnames";
import { useAtom } from "jotai";
import { useMemo } from "react";
import styled, { css } from "styled-components";
import { BlockType } from "src/librarys/block.ts";
import {
  ApplicationMode,
  applicationModeAtom,
  findBlock,
} from "src/librarys/grid.ts";
import { MessageClient } from "src/scripts/message.ts";
import {
  extraLargeBlockMixin,
  extraSmallBlockMixin,
  largeBlockMixin,
  mediumBlockMixin,
  smallBlockMixin,
} from "src/scripts/styled.ts";

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
    ${extraSmallBlockMixin(css`
      ${resizeMixin(0.75)}
    `)}
  }
`;

function ViewBlock({ id, loaded }: ViewBlockProps) {
  const [mode, setMode] = useAtom(applicationModeAtom);
  const { type, status, lock, channel } = findBlock(id);

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
    "modify-mode": mode === ApplicationMode.Modify,
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
  id: number;
  loaded: boolean;
};

export default ViewBlock;
