import { rem, coloraero, pictonblue, colorwhite, colorbabyponder } from '@/styles/global';
import { keyframes, styled } from 'styled-components';

export const Container = styled.div`
  color: ${colorwhite};
  border-radius: 10px;
  font-family: $font-family;
  overflow: hidden;
  text-align: center;
  margin: ${rem(10)} ${rem(10)} ${rem(0)};
  width: ${rem(170)};
  height: ${rem(150)};
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
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom right, ${pictonblue} 75%, ${colorbabyponder});
`;

export const Title = styled.div`
  font-size: ${rem(16)};
  font-weight: bold;
  text-align: center;
  margin-bottom: ${rem(20)};
`;

export const Content = styled.div`
  color: ${colorwhite};
  text-align: center;
  font-size: ${rem(16)};
`;

const AppearFromTop = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const AnimationContainer = styled.div`
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
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  animation: ${AppearFromTop} 1s;
`;
