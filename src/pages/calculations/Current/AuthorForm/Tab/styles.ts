import {
  typeExpense,
  typeFee,
  typeFine,
  typeinstallment,
  typeInterest,
  typePayment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import {
  coloraero,
  colorbabyblue,
  colorexpenses,
  colorfees,
  colorfine,
  colorgray80,
  colorinstallments,
  colorinterest,
  colorlightblue,
  colorpayments,
  colorwhite,
  desktopxxl,
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
  border: 1px solid ${colorgray80};
  box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
  background-color: ${colorwhite};
  ${props =>
    !props.$visibility &&
    css`
      display: none;
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
      border-bottom: 2px solid ${colorgray80};
    `}
  margin-bottom: ${rem(8)};
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownItem = styled.div<{ $colorType?: string; $index?: number; $key: number }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  font-size: ${rem(10)};
  font-weight: 400;
  cursor: pointer;
  position: relative;
  background-color: ${props => {
    if (props.$index == props.$key) return colorbabyblue;
  }};

  &:hover {
    background-color: ${colorbabyblue};
  }

  &::before {
    content: '';
    width: 5px;
    height: 100%;
    background-color: ${props => {
      switch (props.$colorType) {
        case typeFee.id:
          return colorfees;
        case typeFine.id:
          return colorfine;
        case typeinstallment.id:
          return colorinstallments;
        case typeExpense.id:
          return colorexpenses;
        case typePayment.id:
          return colorpayments;
        case typeInterest.id:
          return colorinterest;
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

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding-top: 8px;
`;
