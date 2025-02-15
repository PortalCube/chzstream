import { useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import { MdSmartDisplay } from "react-icons/md";
import { MixerContext } from "@web/librarys/context.ts";
import { setQualityAtom } from "@web/librarys/mixer.ts";
import MixerSlider from "@web/components/modal/mixer/MixerSlider.tsx";

const STEP_VALUE = [360, 480, 720, 1080];
const STEP_MIN = 0;
const STEP_MAX = STEP_VALUE.length - 1;

function MixerQuality({}: MixerQualityProps) {
  const { id, mixer } = useContext(MixerContext);
  const { quality } = mixer;

  const setQuality = useSetAtom(setQualityAtom);

  const displayValue = useMemo(() => `${STEP_VALUE[quality]}p`, [quality]);

  const onInput = (value: number) => {
    setQuality(id, value);
  };

  return (
    <MixerSlider
      icon={MdSmartDisplay}
      value={quality}
      displayValue={displayValue}
      min={STEP_MIN}
      max={STEP_MAX}
      step={1}
      scrollStep={1}
      onInput={onInput}
    />
  );
}

type MixerQualityProps = {};

export default MixerQuality;
