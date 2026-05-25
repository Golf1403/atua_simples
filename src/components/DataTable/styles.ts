import {
  colorbabyponder,
  coloraero,
  colorwhite,
  fontmd,
  fontxl,
  rem,
  desktopxxl,
  colorgray80,
  desktoplg,
} from '@/styles/global';
import { css, keyframes, styled } from 'styled-components';

export const Container = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${rem(16)} 0;

  button + button {
    padding-left: ${rem(8)};
  }
`;

export const Button = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  padding: ${rem(8)};
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${colorwhite};
  font-size: ${fontxl};

  svg {
    position: absolute;
    -webkit-justify-content: space-around;
    -moz-justify-content: space-around;
    -ms-justify-content: space-around;
    justify-content: space-around;
    right: ${rem(8)};
  }
`;

export const Header = styled.th<{ $isAction: boolean }>`
  background-color: ${coloraero};
  font-weight: normal;
  text-align: ${props => (props.$isAction ? 'center' : 'left')};
  width: ${props => (props.$isAction ? rem(80) : undefined)};
  color: ${colorwhite};
  font-size: ${fontxl};
  padding: ${rem(8)};
  border: 1px solid ${colorwhite};

  & > button {
    padding: 0;
  }

  &:first-child {
    border-left: 1px solid ${coloraero};
  }
  &:last-child {
    border-right: 1px solid ${coloraero};
  }
`;

export const Data = styled.td<{ $isAction?: boolean; $isName?: boolean }>`
  padding: ${rem(8)};
  width: ${props => {
    if (props.$isAction) return rem(80);
  }};
  min-width: ${props => {
    if (props.$isName) return rem(80);
  }};
  max-width: ${rem(100)};
  flex: ${props => props.$isName && 1};
  text-align: ${props => (props.$isAction ? 'center' : 'left')};
  border: 1px solid ${coloraero};
  ${props => css`
    overflow: ${props.$isAction ? 'visible' : 'hidden'};
    text-overflow: ${props.$isAction ? 'initial' : 'ellipsis'};
    text-overflow: ${props.$isAction ? 'initial' : '...'};
  `};
`;

export const Row = styled.tr`
  font-size: ${fontmd};
  &:hover {
    background-color: ${colorgray80};
  }
`;

const loadingEffect = keyframes`
  0% {
    background: linear-gradient(to left, ${coloraero}, ${coloraero}, ${colorbabyponder});
  }
  100% {
    background: linear-gradient(to right, ${coloraero}, ${coloraero}, ${colorbabyponder});
  }
`;

export const LoadingEffectContainer = styled.div<{ $index: number }>`
  width: 100%;
  height: ${rem(16)};
  opacity: 0.2;
  animation: ${loadingEffect} 1s linear infinite;
`;

export const Head = styled.thead``;
export const Body = styled.tbody``;
