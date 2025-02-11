import classNames from "classnames";
import { useEffect, useMemo, useRef } from "react";
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

  &.mute {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const SliderForeground = styled.div<{ value: number }>`
  width: ${({ value }) => value}%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba(255, 255, 255, 0.7);

  &.mute {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Text = styled.p`
  flex-grow: 1;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);

  font-variant-numeric: tabular-nums;

  &.mute {
    color: rgba(255, 255, 255, 0.2);
  }
`;

function MixerSlider({
  icon: Icon,
  value,
  displayValue,
  min,
  max,
  step,
  scrollStep = 1,
  mute = false,
  onInput,
  onIconClick,
}: MixerSliderProps) {
  const percentage = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  );

  const onSliderInput: React.FormEventHandler<HTMLInputElement> = (event) => {
    const value = Number(event.currentTarget.value);
    onInput(value);
  };

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onSliderWheel = (event: WheelEvent) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLInputElement;

      const delta = -Math.sign(event.deltaY) * scrollStep;
      const value = Number(target.value) + delta;
      const clampedValue = Math.min(Math.max(value, min), max);

      onInput(clampedValue);
    };

    let element: HTMLInputElement;

    if (ref.current) {
      element = ref.current;
      element.addEventListener("wheel", onSliderWheel);
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", onSliderWheel);
      }
    };
  }, [ref, min, max, scrollStep, onInput]);

  const muteClassName = classNames({
    mute,
  });

  const iconButtonClassNames = classNames({
    active: onIconClick !== undefined,
  });

  return (
    <Container>
      <IconButton className={iconButtonClassNames} onClick={onIconClick}>
        <Icon />
      </IconButton>
      <Slider>
        <SliderBackground className={muteClassName} />
        <SliderForeground className={muteClassName} value={percentage} />
        <Input
          ref={ref}
          type="range"
          width="90"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={onSliderInput}
        />
      </Slider>
      <Text className={muteClassName}>{displayValue}</Text>
    </Container>
  );
}

type MixerSliderProps = {
  icon: React.ElementType;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  scrollStep?: number;
  mute?: boolean;
  onInput: (value: number) => void;
  onIconClick?: React.MouseEventHandler;
};

export default MixerSlider;
