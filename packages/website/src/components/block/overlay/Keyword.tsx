import styled, { css } from "styled-components";

import { Mixin } from "@web/scripts/styled.ts";

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

  line-height: 0;
  transform: scale(0.9) rotate(${({ $rotation }) => $rotation}deg);

  ${Mixin.block.greater.extraLarge(css`
    padding: 12px;
    margin: -6px -8px;
    border-radius: 16px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    padding: 10px;
    margin: -6px -6px;
    border-radius: 12px;
  `)}
  
  ${Mixin.block.less.large(css`
    padding: 8px;
    margin: -4px -4px;
    border-radius: 10px;
  `)}
  
  ${Mixin.block.less.medium(css`
    padding: 0px 6px;
    margin: -4px -3px;
    border-radius: 8px;
  `)}
  
  ${Mixin.block.less.small(css`
    padding: 0px 4px;
    margin: -3px -2px;
    margin-bottom: 0px;
    border-radius: 6px;
  `)}

 

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
  icon: (props: object) => React.ReactNode;
  textColor: string;
  backgroundColor: string;
};

export default Keyword;
