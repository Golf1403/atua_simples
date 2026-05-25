import { typeFeeArt, typeFineArt } from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  coloraero,
  colorbabyblue,
  colorbabyponder,
  colorfees,
  colorfine,
  colorgray80,
  colorlightblue,
  colorwhite,
  desktopxxl,
  fontlg,
  fontmd,
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
  min-width: 400px;
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
    min-width: ${rem(300)};
    span {
      font-size: ${fontmd};
    }
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
  font-size: ${fontsm};
  line-height: ${linesm};
  padding-left: ${rem(24)};
  color: ${coloraero};
  font-weight: bold;
  width: ${props => props.$width && `${props.$width}%`};

  svg {
    font-size: ${fontxl};
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
      font-size: ${rem(16)};
    }
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

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props: { $isOpen: boolean }) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding-top: 8px;
`;
export const DropdownItem = styled.a<{ $colorType?: string }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: ${colorbabyblue};
  }

  &::before {
    content: '';
    width: 5px;
    height: 100%;
    background-color: ${props => {
      switch (props.$colorType) {
        case typeFeeArt.id:
          return colorfees;
        case typeFineArt.id:
          return colorfine;
        default:
          return '#000';
      }
    }};
    position: absolute;
    left: 0;
    top: 0;
  }

  padding-left: 20px;
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
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
