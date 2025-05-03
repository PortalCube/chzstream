import MixerVolume from "@web/components/modal/mixer/MixerVolume.tsx";
import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { MixerContext } from "@web/librarys/context.ts";
import {
  type MixerItem,
  setLockAtom,
  setSoloAtom,
  soloBlockIdAtom,
  updateMuteAtom,
} from "@web/librarys/mixer.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 8px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  transition:
    opacity 100ms,
    background-color 100ms;

  opacity: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.hide {
    /* opacity: 0.5; */
  }
`;

const Block = styled.div`
  width: 180px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BlockIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;

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

function MixerItem({ item }: MixerItemProps) {
  const setLock = useSetAtom(setLockAtom);
  const setSolo = useSetAtom(setSoloAtom);

  const updateMute = useSetAtom(updateMuteAtom);

  const { id, icon, name, mixer } = item;
  const { lock } = mixer;
  const soloBlockId = useAtomValue(soloBlockIdAtom);
  const solo = useMemo(() => soloBlockId === id, [soloBlockId, id]);

  const onLockClick: React.MouseEventHandler = () => {
    setLock(id, null);
  };

  const onSoloClick: React.MouseEventHandler = () => {
    setSolo(id, null);
    updateMute(0);
  };

  const isSpecialItem = useMemo(() => id === null || id === 0, [id]);

  const className = classNames({
    hide: !isSpecialItem && soloBlockId !== null && solo === false,
  });

  const blockIconClassName = classNames({
    hidden: isSpecialItem,
  });

  const lockButtonClassName = classNames({
    active: lock,
    hidden: isSpecialItem,
  });

  const soloButtonClassName = classNames({
    active: solo,
    hidden: isSpecialItem,
  });

  return (
    <MixerContext.Provider value={item}>
      <Container className={className}>
        <Block>
          <BlockIcon
            src={icon ?? getProfileImageUrl()}
            className={blockIconClassName}
          />
          <BlockText>{name}</BlockText>
        </Block>
        <MixerVolume />
        <LockButton className={lockButtonClassName} onClick={onLockClick}>
          LOCK
        </LockButton>
        <SoloButton className={soloButtonClassName} onClick={onSoloClick}>
          SOLO
        </SoloButton>
      </Container>
    </MixerContext.Provider>
  );
}

type MixerItemProps = {
  item: MixerItem;
};

export default MixerItem;
