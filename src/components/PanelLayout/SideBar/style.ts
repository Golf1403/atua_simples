import { rem } from '@/styles/global';
import { keyframes, styled } from 'styled-components';

const AppearFromLeft = keyframes`
  from {
    opacity: 0.6;
    transform: translateX(${rem(-2)});
  }
  to {
    opacity: 1;
    transform: translateX(${rem(0)});
  }
`;
const AppearFromRight = keyframes`
  from {
    opacity: 0.6;
    transform: translateX(0);
  }
  to {
    opacity: 1;
    transform: translateX(-180px);
  }
`;

export const Content = styled.div<{ $open: boolean; $display: string }>`
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
  animation: ${props => (props.$open ? AppearFromLeft : AppearFromRight)} 1s;
  display: ${props => props.$display};
`;
export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
`;

export const Header = styled.header`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
`;
