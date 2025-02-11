import classNames from "classnames";
import { useMemo } from "react";
import {
  MdSmartDisplay,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  width: 190px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const IconButton = styled.button`
  margin: -4px;
  padding: 4px;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: none;

  & > svg {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.5);
  }

  &.active {
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Slider = styled.div`
  width: 90px;
  height: 10px;
  border-radius: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  transition: height 100ms;

  overflow: hidden;

  &:hover {
    height: 16px;
  }
`;

const Input = styled.input`
  left: -10px;
  right: -10px;
  top: -4px;
  bottom: -4px;

  position: absolute;
  cursor: pointer;
  opacity: 0;
`;

const SliderBackground = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

const SliderForeground = styled.div<{ value: number }>`
  width: ${({ value }) => value}%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba(255, 255, 255, 0.7);
`;

const Text = styled.p`
  flex-grow: 1;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);

  font-variant-numeric: tabular-nums;
`;

const STEP_VALUE = [360, 480, 720, 1080];
const STEP_MIN = 0;
const STEP_MAX = STEP_VALUE.length - 1;

function MixerSlider({
  value,
  onInput,
  onIconClick,
  isQuality = false,
}: MixerSliderProps) {
  const { Icon, min, max, step, percentage, valueText } = useMemo(() => {
    if (isQuality) {
      const percentage = ((value - STEP_MIN) / (STEP_MAX - STEP_MIN)) * 100;
      const valueText = `${STEP_VALUE[value]}p`;

      return {
        Icon: MdSmartDisplay,
        min: STEP_MIN,
        max: STEP_MAX,
        step: 1,
        percentage,
        valueText,
      };
    } else {
      let Icon;
      if (value === 0) {
        Icon = MdVolumeOff;
      } else if (value < 50) {
        Icon = MdVolumeDown;
      } else {
        Icon = MdVolumeUp;
      }

      const percentage = value;
      const valueText = `${value}%`;

      return {
        Icon,
        min: 0,
        max: 100,
        step: 1,
        percentage,
        valueText,
      };
    }
  }, [isQuality, value]);

  const onSliderInput: React.FormEventHandler<HTMLInputElement> = (event) => {
    const value = Number(event.currentTarget.value);
    onInput(value);
  };

  const onSliderWheel: React.WheelEventHandler<HTMLInputElement> = (event) => {
    const delta = -Math.sign(event.deltaY);
    const deltaModifier = isQuality ? 1 : 5;

    const value = Number(event.currentTarget.value) + delta * deltaModifier;
    const clampedValue = Math.min(Math.max(value, min), max);

    onInput(clampedValue);
  };

  const iconButtonClassNames = classNames({
    active: onIconClick !== undefined,
  });

  return (
    <Container>
      <IconButton className={iconButtonClassNames} onClick={onIconClick}>
        <Icon />
      </IconButton>
      <Slider>
        <SliderBackground />
        <SliderForeground value={percentage} />
        <Input
          type="range"
          width="90"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={onSliderInput}
          onWheel={onSliderWheel}
        />
      </Slider>
      <Text>{valueText}</Text>
    </Container>
  );
}

type MixerSliderProps = {
  value: number;
  isQuality: boolean;
  onInput: (value: number) => void;
  onIconClick?: React.MouseEventHandler;
};

export default MixerSlider;
