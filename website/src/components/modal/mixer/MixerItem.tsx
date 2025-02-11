import classNames from "classnames";
import React, { useMemo } from "react";
import { useMixer } from "src/librarys/mixer.ts";
import styled from "styled-components";
import MixerSlider from "./MixerSlider.tsx";

const Container = styled.div`
  padding: 8px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Block = styled.div`
  width: 180px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BlockIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  background-color: rgba(40, 255, 119, 1);
  color: rgba(0, 0, 0, 1);

  font-weight: 600;
  font-size: 16px;

  &.hidden {
    display: none;
  }
`;

const BlockText = styled.p`
  flex-grow: 1;
  font-weight: 600;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 600;

  background: none;
  cursor: pointer;

  transition: background-color 200ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.hidden {
    visibility: hidden;
  }
`;

const LockButton = styled(Button)`
  color: rgba(255, 85, 150, 1);

  &.active {
    background-color: rgb(255, 85, 150);
    color: rgb(0, 0, 0);

    &:hover {
      background-color: rgb(255, 102, 161);
    }
  }
`;

const SoloButton = styled(Button)`
  color: rgb(0, 124, 225);

  &.active {
    background-color: rgb(0, 124, 225);
    color: rgb(255, 255, 255);

    &:hover {
      background-color: rgb(14, 141, 246);
    }
  }
`;

function MixerItem({ id }: MixerItemProps) {
  const {
    findMixerItem,
    getSolo,
    getVolume,
    setQuality,
    setVolume,
    switchMute,
    switchLock,
    switchSolo,
  } = useMixer();
  const mixerItem = findMixerItem(id);
  const solo = getSolo(id);
  const volume = getVolume(id);
  const { name, setting } = mixerItem;

  const onQualityInput = (value: number) => {
    setQuality(id, value);
  };

  const onVolumeInput = (value: number) => {
    setVolume(id, value);
  };

  const onMuteClick: React.MouseEventHandler = () => {
    switchMute(id);
  };

  const onLockClick: React.MouseEventHandler = () => {
    switchLock(id);
  };

  const onSoloClick: React.MouseEventHandler = () => {
    switchSolo(id);
  };

  const blockIconClassName = classNames({
    hidden: id === null || id === 0,
  });

  const lockButtonClassName = classNames({
    active: setting.lock,
    hidden: id === null || id === 0,
  });

  const soloButtonClassName = classNames({
    active: solo,
    hidden: id === null || id === 0,
  });

  return (
    <Container>
      <Block>
        <BlockIcon className={blockIconClassName}>{id}</BlockIcon>
        <BlockText>{name}</BlockText>
      </Block>
      <MixerSlider
        value={setting.quality}
        onInput={onQualityInput}
        isQuality={true}
      />
      <MixerSlider
        value={volume}
        onInput={onVolumeInput}
        onIconClick={onMuteClick}
        isQuality={false}
      />
      <LockButton className={lockButtonClassName} onClick={onLockClick}>
        LOCK
      </LockButton>
      <SoloButton className={soloButtonClassName} onClick={onSoloClick}>
        SOLO
      </SoloButton>
    </Container>
  );
}

type MixerItemProps = {
  id: number | null;
};

export default MixerItem;
