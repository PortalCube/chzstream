import styled, { css } from "styled-components";

import { Mixin } from "src/scripts/styled.ts";

type ContainerProps = {
  $background: string;
  $color: string;
  $rotation: number;
};

const Container = styled.span<ContainerProps>`
  color: ${({ $color }) => $color};
  background-color: ${({ $background }) => $background};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${Mixin.block.greater.extraLarge(css`
    padding: 6px 12px;
    margin: -6px -8px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    padding: 6px 10px;
    margin: -6px -6px;
  `)}
  
  ${Mixin.block.less.large(css`
    padding: 4px 8px;
    margin: -4px -4px;
  `)}
  
  ${Mixin.block.less.medium(css`
    padding: 4px 4px;
    margin: -4px -4px;
  `)}
  
  ${Mixin.block.less.small(css`
    padding: 2px 4px;
    margin: -2px -2px;
  `)}

  transform: scale(0.9) rotate(${({ $rotation }) => $rotation}deg);

  & > svg {
    ${Mixin.block.greater.extraLarge(css`
      width: 36px;
      height: 36px;
    `)}

    ${Mixin.block.less.extraLarge(css`
      width: 28px;
      height: 28px;
    `)}
    
    ${Mixin.block.less.large(css`
      width: 20px;
      height: 20px;
    `)}
    
    ${Mixin.block.less.medium(css`
      width: 16px;
      height: 16px;
    `)}
    
    ${Mixin.block.less.small(css`
      width: 14px;
      height: 14px;
    `)}
  }
`;

const randomRange = (min: number, max: number, precision: number) => {
  const p = Math.pow(10, precision);
  return Math.trunc((Math.random() * (max - min) + min) * p) / p;
};

function Keyword({
  text,
  icon: Icon,
  textColor,
  backgroundColor,
}: KeywordProps) {
  // const rotation = useMemo(() => randomRange(-3, 3, 1), []);

  return (
    <Container $background={backgroundColor} $color={textColor} $rotation={0}>
      {text} <Icon />
    </Container>
  );
}

export type KeywordProps = {
  text: string;
  icon: (props: object) => JSX.Element;
  textColor: string;
  backgroundColor: string;
};

export default Keyword;
