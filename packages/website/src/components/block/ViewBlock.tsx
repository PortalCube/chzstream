import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { layoutModeAtom } from "@web/librarys/app.ts";
import { BlockContext } from "@web/librarys/context";
import { modifyBlockStatusAtom } from "@web/librarys/layout.ts";
import { Mixin } from "@web/scripts/styled.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
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

  &.loading {
    pointer-events: none;
  }

  &.chat {
    ${Mixin.block.less.small(css`
      ${resizeMixin(0.75)}
    `)}
  }
`;

function ViewBlock({}: ViewBlockProps) {
  const layoutMode = useAtomValue(layoutModeAtom);
  const { id, type, status, channel } = useContext(BlockContext);
  const modifyBlockStatus = useSetAtom(modifyBlockStatusAtom);
  const messageClient = useAtomValue(messageClientAtom);

  const src = useMemo((): string => {
    // 채널 정보가 비어있는 블록
    if (channel === null) {
      return "about:blank";
    }

    // 아직 활성화되지 않음
    if (status.enabled === false) {
      return "about:blank";
    }

    // 새로고침
    if (status.refresh === true) {
      modifyBlockStatus(id, {
        enabled: layoutMode === "view",
        refresh: false,
        loading: true,
      });
      return "about:blank";
    }

    const href =
      type === "chat"
        ? `https://chzzk.naver.com/live/${channel.uuid}/chat`
        : `https://chzzk.naver.com/live/${channel.uuid}/`;
    const url = new URL(href);

    url.searchParams.set("embed", "true");

    if (messageClient !== null) {
      url.searchParams.set("_csp", messageClient.id.id);
      url.searchParams.set("_csi", id.toString());
    }

    return url.toString();
  }, [messageClient, id, channel, status, type, layoutMode]);

  const className = classNames({
    loading: status.loading,
    "modify-mode": layoutMode === "modify",
    chat: type === "chat",
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

type ViewBlockProps = {};

export default ViewBlock;
