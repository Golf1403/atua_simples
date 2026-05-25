import { coloraero, colorwhite, rem } from '@/styles/global';
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
`;
export const OverlayContainer = styled.div`
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
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  z-index: 11;
  color: ${coloraero};
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

export const Message = styled.span`
  margin-top: ${rem(16)};
  color: ${colorwhite};
`;
