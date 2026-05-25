import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  height: 60vh;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
`;

const SpinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  animation: ${SpinAnimation} 1s cubic-bezier(0.42, 0.8, 0.6, 0.83) infinite;
  width: fit-content;
  margin: 0 auto;
`;
