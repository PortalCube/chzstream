import classNames from "classnames";
import { useContext } from "react";

import LogoImage from "@web/assets/logo.png";
import { BlockContext } from "@web/librarys/context";

import styled from "styled-components";

const Container = styled.div`
  position: absolute;

  border-radius: 8px;

  top: var(--block-margin-base);
  left: var(--block-margin-base);
  right: var(--block-margin-base);
  bottom: var(--block-margin-base);
  background-color: rgba(0, 0, 0, 1);

  overflow: hidden;
`;

const Filter = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  box-shadow: inset 0 0 32px rgba(0, 0, 0, 0.5);

  background: linear-gradient(
    360deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 30%
  );
`;

const Thumbnail = styled.img`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  transition: opacity 200ms;

  &.hidden {
    opacity: 0;
  }
`;

const Blur = styled.img`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  background-color: rgb(32, 32, 32);

  filter: blur(64px) brightness(0.75);

  transition:
    opacity 200ms,
    filter 200ms;

  &.hidden {
    opacity: 0;
  }

  &.thumbnail {
    filter: blur(64px) brightness(0.3);
  }
`;

const Placeholder = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  max-width: 100%;
  max-height: 100%;

  margin: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #333333;

  transition:
    opacity 200ms,
    width 100ms,
    height 100ms;

  &.hidden {
    opacity: 0;
  }

  &.thumbnail {
    aspect-ratio: 16 / 9;
  }
`;

const Logo = styled.img`
  object-fit: contain;
  width: 40%;
`;

function Background({}: BackgroundProps) {
  const { type, channel } = useContext(BlockContext);

  const thumbnailUrl = channel?.thumbnailUrl ?? "";
  const iconUrl = channel?.iconUrl ?? "";
  const name = channel?.name ?? "알 수 없는 채널";

  const showThumbnail = type === "stream" && thumbnailUrl !== "";
  const showBlur = iconUrl !== "";
  const showPlaceholder =
    channel === null || (type === "stream" && thumbnailUrl === "");

  const thumbnailClass = classNames({
    hidden: showThumbnail === false,
  });

  const blurClass = classNames({
    hidden: showBlur === false,
    thumbnail: type === "stream",
  });

  const placeholderClass = classNames({
    hidden: showPlaceholder === false,
    thumbnail: channel !== null || type === "stream",
  });

  return (
    <Container>
      <Blur className={blurClass} src={iconUrl} alt={name} />
      <Thumbnail className={thumbnailClass} src={thumbnailUrl} alt={name} />
      <Placeholder className={placeholderClass}>
        <Logo src={LogoImage} />
      </Placeholder>
      <Filter />
    </Container>
  );
}
type BackgroundProps = {};

export default Background;
