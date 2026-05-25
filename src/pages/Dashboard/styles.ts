import { colorbabyponder, coloraero, rem } from '@/styles/global';
import { keyframes, styled } from 'styled-components';

const AppearFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const AppearFromDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
    display: none;
  }
`;

export const Header = styled.header<{ $toggle?: boolean }>`
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
  width: 100%;
`;

export const Button = styled.button`
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
  align-items: center;
  background: none;
  font-weight: bold;
  font-size: ${rem(20)};
  color: ${coloraero};
  margin-top: rem(10);
`;

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  max-width: 100%;
  height: 85vh;
`;

export const Dash = styled.div<{ $toggle?: boolean; $display: string }>`
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  width: 100%;
  display: ${props => props.$display};
  animation: ${props => (props.$toggle ? AppearFromTop : AppearFromDown)} 1s;
`;

export const Image = styled.img<{ $isLoading: boolean }>`
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: ${rem(1)};
  margin: 10px;
  box-shadow: 0 0 ${rem(2)} ${rem(1)} ${colorbabyponder};
  display: ${props => (props.$isLoading ? 'none' : 'block')};
  min-width: 100%;
  min-height: 100%;
  height: max-content;
  max-height: 500px;
  max-width: 900px;
`;
