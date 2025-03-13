import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  type MixerItem,
  setLockAtom,
  setSoloAtom,
  soloBlockIdAtom,
  updateMuteAtom,
} from "@web/librarys/mixer.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useContext, useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 8px;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  flex-grow: 1;

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

  transition: background-color 100ms;

  background-color: rgb(42, 42, 42);

  &:hover {
    background-color: rgb(50, 50, 50);
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

function MixerItem({}: MixerItemProps) {
  const block = useContext(BlockContextMenuContext);
  const setLock = useSetAtom(setLockAtom);
  const setSolo = useSetAtom(setSoloAtom);

  const updateMute = useSetAtom(updateMuteAtom);

  const { id, lock } = useMemo(() => {
    const result = {
      id: 0,
      lock: false,
    };
    if (block === null) return result;

    result.id = block.id;
    if (block.mixer === null) return result;

    result.lock = block.mixer.lock;

    return result;
  }, [block]);

  const soloBlockId = useAtomValue(soloBlockIdAtom);
  const solo = useMemo(() => soloBlockId === id, [soloBlockId, id]);

  const onLockClick: React.MouseEventHandler = () => {
    setLock(id, null);
  };

  const onSoloClick: React.MouseEventHandler = () => {
    setSolo(id, null);
    updateMute(0);
  };

  const lockButtonClassName = classNames({
    active: lock,
  });

  const soloButtonClassName = classNames({
    active: solo,
  });

  return (
    <Container>
      <LockButton className={lockButtonClassName} onClick={onLockClick}>
        LOCK
      </LockButton>
      <SoloButton className={soloButtonClassName} onClick={onSoloClick}>
        SOLO
      </SoloButton>
    </Container>
  );
}

type MixerItemProps = {};

export default MixerItem;
