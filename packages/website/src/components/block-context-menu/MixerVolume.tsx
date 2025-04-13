import ButtonMenuSlider from "@web/components/block-context-menu/ButtonMenuSlider";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  setMuteAtom,
  setVolumeAtom,
  soloBlockIdAtom,
  updateMuteAtom,
  updateVolumeAtom,
} from "@web/librarys/mixer.ts";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import { MdVolumeDown, MdVolumeOff, MdVolumeUp } from "react-icons/md";

function MixerVolume({}: MixerVolumeProps) {
  const block = useContext(BlockContextMenuContext);

  const { id, volume, muted } = useMemo(() => {
    const result = {
      id: 0,
      volume: 0,
      muted: false,
    };
    if (block === null) return result;

    result.id = block.id;

    if (block.mixer === null) return result;

    result.volume = block.mixer.volume;
    result.muted = block.mixer.muted;

    return result;
  }, [block]);

  const soloBlockId = useAtomValue(soloBlockIdAtom);
  const solo = useMemo(() => soloBlockId === id, [soloBlockId, id]);

  const setVolume = useSetAtom(setVolumeAtom);
  const setMute = useSetAtom(setMuteAtom);

  const updateVolume = useSetAtom(updateVolumeAtom);
  const updateMute = useSetAtom(updateMuteAtom);

  const isSpecialItem = useMemo(() => id === null || id === 0, [id]);

  const displayValue = useMemo(() => `${volume}%`, [volume]);

  const mute = useMemo(() => {
    if (soloBlockId !== null && solo === false && !isSpecialItem) {
      return true;
    }

    if (muted) {
      return true;
    }

    return false;
  }, [isSpecialItem, soloBlockId, solo, muted]);

  const icon = useMemo(() => {
    if (muted) {
      return MdVolumeOff;
    } else if (volume < 50) {
      return MdVolumeDown;
    } else {
      return MdVolumeUp;
    }
  }, [volume, muted]);

  const onInput = (value: number) => {
    const result = setVolume(id, value);

    if (result === null) return;

    // 새로운 볼륨값이 0이면 음소거, 아니면 음소거 해제
    setMute(id, result === 0);

    if (id !== null) {
      // 새로운 값을 플레이어에 적용
      updateVolume(id);
      updateMute(id);
    }
  };

  const onIconClick = () => {
    const result = setMute(id, null);

    if (result === null) return;

    // 음소거를 해제했는데 볼륨이 0이라면, 볼륨을 10으로 설정
    if (result === false && volume === 0) {
      setVolume(id, 10);
    }

    if (id !== null) {
      // 새로운 값을 플레이어에 적용
      updateMute(id);
      updateVolume(id);
    }
  };

  const options = {
    icon,
    value: volume,
    displayValue,
    min: 0,
    max: 100,
    step: 1,
    scrollStep: 5,
    mute,
    onInput,
    onIconClick,
  };

  return <ButtonMenuSlider options={options} />;
}

type MixerVolumeProps = {};

export default MixerVolume;
