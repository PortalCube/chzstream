import styled, { keyframes } from "styled-components";

// Original Source: https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/ring-resize.svg

const Container = styled.div`
  height: 48px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const rotateAnimation = keyframes`
    100% {
      transform: rotate(360deg);
    }
`;

const tailAnimation = keyframes`
    0% {
      stroke-dasharray: 0 150;
      stroke-dashoffset: 0;
    }
    47.5% {
      stroke-dasharray: 42 150;
      stroke-dashoffset: -16;
    }
    95%,
    100% {
      stroke-dasharray: 42 150;
      stroke-dashoffset: -59;
    }
`;

const Spinner = styled.svg`
  & > g {
    transform-origin: center;
    animation-name: ${rotateAnimation};
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  & > g > circle {
    stroke-linecap: round;
    animation-name: ${tailAnimation};
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
`;

function CircleSpinner() {
  return (
    <Container>
      <Spinner
        width="72"
        height="72"
        stroke="#dfdfdf"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="2"></circle>
        </g>
      </Spinner>
    </Container>
  );
}

export default CircleSpinner;
