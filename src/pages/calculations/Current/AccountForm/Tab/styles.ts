import {
  coloraero,
  colorbabyponder,
  colorgray80,
  colorlightblue,
  colorwhite,
  desktopxxl,
  fontlg,
  fontsm,
  fontxl,
  linesm,
  rem,
} from '@/styles/global';
import { css, styled } from 'styled-components';

export const TitleContainer = styled.button`
  background-color: transparent;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 300px;
  min-width: 320px;
  width: 100%;
  height: ${rem(43)};

  &:focus {
    color: ${coloraero};
    font-weight: bold;
    scale: 1.02;
    border: ${`${rem(2)} solid ${colorlightblue}`};
    padding: ${rem(3)};
    border-radius: ${rem(40)};
  }

  @media (max-width: ${desktopxxl}) {
    max-width: ${rem(300)};
    min-width: ${rem(100)};
  }
`;
export const NumberContainer = styled.div`
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
  align-items: center;
`;

export const ResultInfoContainer = styled.div<{ $width?: number }>`
  font-size: ${fontlg};
  line-height: ${linesm};
  padding-left: ${rem(24)};
  color: ${coloraero};
  font-weight: bold;
  width: ${props => props.$width && `${props.$width}%`};

  svg {
    font-size: ${fontxl};
  }

  @media (max-width: ${desktopxxl}) {
    font-size: ${fontsm};
  }
`;

export const ResultContainer = styled.div`
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
  align-items: center;
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;

  input {
    background-color: transparent;
    &:focus {
      color: ${coloraero};
      font-weight: bold;
    }
  }
`;
export const ResultTitleContainer = styled.button`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${coloraero};
  cursor: pointer;
  font-weight: bold;
  font-size: ${fontlg};
  width: 100%;
  max-width: ${rem(120)};
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  &:focus {
    border-color: ${colorbabyponder};
    color: ${coloraero};
    font-weight: bold;
    scale: 1.2;
    border: ${`${rem(2)} solid ${colorlightblue}`};
    padding: ${rem(3)};
    border-radius: ${rem(40)};
  }
`;
export const Container = styled.div<{ $visibility: boolean }>`
  margin-top: ${fontxl};
  margin-bottom: ${rem(48)};

  ${props =>
    props.$visibility &&
    css`
      border: 1px solid ${colorgray80};
      box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
      background-color: ${colorwhite};
    `}
`;
export const ChildrenContainer = styled.div<{ $visibility: boolean }>`
  display: ${props => (props.$visibility ? 'flex' : 'none')};
  padding: ${fontxl};
`;
export const Header = styled.div`
  position: absolute;
  top: -${rem(28)};
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  label,
  input {
    color: ${coloraero};
    font-size: ${fontxl};
    font-weight: bold;
    text-align: end;
  }
`;

export const HeaderContainer = styled.div`
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
  width: 100%;
  max-width: none;
  position: relative;
`;
export const HorizontalLine = styled.div<{ $visibility: boolean }>`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  justify-content: flex-start;
  align-items: baseline;
  width: 100%;
  ${props =>
    !props.$visibility &&
    css`
      border-bottom: 1px solid ${coloraero};
    `}
  margin-bottom: ${rem(8)};
`;
