import { useState } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  height: 48px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const spinnerAnimation = keyframes`
    0% {
      height: 48px;
      background-color: rgb(150, 150, 150);
    }
    100% {
      height: 8px;
      background-color: rgb(100, 100, 100);
    }
`;

const Item = styled.div<{ $delay: number }>`
  width: 6px;
  border-radius: 8px;
  box-sizing: border-box;

  animation-name: ${spinnerAnimation};
  animation-duration: 700ms;
  animation-delay: ${(props) => props.$delay}ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const itemCount = 5;
const itemDelay = 200;
const startDelay = -itemDelay * itemCount;

function Spinner() {
  const [randomDelay] = useState(randomRange(-500, 0));

  const elements = Array.from({ length: itemCount }, (_, i) => i).map((i) => (
    <Item $delay={startDelay + randomDelay + i * itemDelay} key={i} />
  ));

  return <Container>{elements}</Container>;
}

export default Spinner;
