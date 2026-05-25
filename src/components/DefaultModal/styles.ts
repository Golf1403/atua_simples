import { colorbabyponder, coloraero, rem, colorsummergreen, colorred } from '@/styles/global';
import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
  z-index: 20;
`;

export const ModalContainer = styled.div`
  position: relative;
  background: ${colorbabyponder};
  border-radius: ${rem(8)};
  min-width: ${rem(280)};
  min-height: ${rem(120)};
  max-height: 100%;
  overflow-y: auto;
  padding: 0 ${rem(8)} 0 ${rem(8)};
  box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
  z-index: 11;
`;

export const Header = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  -moz-justify-content: flex-end;
  -ms-justify-content: flex-end;
  justify-content: flex-end;
  width: calc(100% - ${rem(8)});
  align-items: center;
  height: ${rem(46)};
  color: ${coloraero};
  font-weight: bold;
  border-bottom: 1px solid ${coloraero};
  svg {
    font-size: ${rem(24)};
    padding: ${rem(2)};
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
`;

export const Button = styled.button`
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
  background: transparent;
  height: ${rem(24)};
  margin-left: ${rem(8)};
  font-size: ${rem(24)};
  color: ${coloraero};
  cursor: pointer;
`;

export const TitleContainer = styled.div`
  width: 100%;
`;
export const Title = styled.div`
  width: 100%;
  text-indent: ${rem(8)};
`;
