import ButtonMenuSlider from "@web/components/block-context-menu/ButtonMenuSlider";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import { setQualityAtom, updateQualityAtom } from "@web/librarys/mixer.ts";
import { useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import { MdSmartDisplay } from "react-icons/md";

const STEP_VALUE = [360, 480, 720, 1080];
const STEP_MIN = 0;
const STEP_MAX = STEP_VALUE.length - 1;

function MixerQuality({}: MixerQualityProps) {
  const block = useContext(BlockContextMenuContext);

  const { id, quality } = useMemo(() => {
    const result = {
      id: 0,
      quality: 0,
    };
    if (block === null) return result;

    result.id = block.id;

    if (block.mixer === null) return result;

    result.quality = block.mixer.quality;

    return result;
  }, [block]);

  const setQuality = useSetAtom(setQualityAtom);
  const updateQuality = useSetAtom(updateQualityAtom);

  const displayValue = useMemo(() => `${STEP_VALUE[quality]}p`, [quality]);

  const onInput = (value: number) => {
    setQuality(id, value);
    updateQuality(id);
  };

  const options = {
    icon: MdSmartDisplay,
    value: quality,
    displayValue,
    min: STEP_MIN,
    max: STEP_MAX,
    step: 1,
    onInput,
  };

  return <ButtonMenuSlider options={options} />;
}

type MixerQualityProps = {};

export default MixerQuality;
