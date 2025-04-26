import { messageClientAtom } from "@web/hooks/useMessageClient.ts";
import { layoutModeAtom } from "@web/librarys/app.ts";
import { BlockChannel } from "@web/librarys/block.ts";
import { BlockContext } from "@web/librarys/context";
import { modifyBlockStatusAtom } from "@web/librarys/layout.ts";
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

const Container = styled.iframe<{ $zoom: number }>`
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

  // zoom level
  ${(props) => resizeMixin(props.$zoom)}
`;

function getIframeBaseUrl(channel: BlockChannel, type: string): string {
  if (channel === null) {
    return "about:blank";
  }

  if (channel.platform === "chzzk") {
    if (type === "stream") {
      return `https://chzzk.naver.com/live/${channel.channelId}/`;
    } else {
      return `https://chzzk.naver.com/live/${channel.channelId}/chat`;
    }
  } else if (channel.platform === "youtube") {
    if (type === "stream") {
      return `https://www.youtube.com/embed/${channel.liveId}`;
    } else {
      return `https://www.youtube.com/live_chat?v=${channel.liveId}`;
    }
  }

  return "about:blank";
}

function ViewBlock({}: ViewBlockProps) {
  const layoutMode = useAtomValue(layoutModeAtom);
  const { id, type, status, channel, options } = useContext(BlockContext);
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

    const baseUrl = getIframeBaseUrl(channel, type);
    const url = new URL(baseUrl);

    if (channel.platform === "chzzk") {
      url.searchParams.set("embed", "true");
    }

    if (channel.platform === "youtube" && type === "stream") {
      url.searchParams.set("autoplay", "1");
    }

    if (channel.platform === "youtube" && type === "chat") {
      url.searchParams.set("embed_domain", location.hostname);
      url.searchParams.set("dark_theme", "1");
    }

    if (messageClient !== null) {
      url.searchParams.set("_csp", messageClient.id.id);
      url.searchParams.set("_csi", id.toString());
    }

    return url.toString();
  }, [messageClient, id, channel, status, type, layoutMode]);

  const className = classNames({
    loading: status.loading,
    "modify-mode": layoutMode === "modify",
  });

  return (
    <Container
      className={className}
      src={src}
      $zoom={options.zoom}
      scrolling="no"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></Container>
  );
}

type ViewBlockProps = {};

export default ViewBlock;
