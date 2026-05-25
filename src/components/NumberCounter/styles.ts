import { rem, fontfamily, colorstategray } from '@/styles/global';
import { keyframes, styled } from 'styled-components';

export const Container = styled.div`
  color: ${colorstategray};
  border-radius: 10px;
  font-family: ${fontfamily};
  overflow: hidden;
  text-align: center;
`;

export const Content = styled.label`
  color: ${colorstategray};
  text-align: center;
  font-size: ${rem(16)};

  min-width: ${rem(300)};
`;

const AppearFromTop = keyframes`
  from {
    opacity: 0.6;
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
