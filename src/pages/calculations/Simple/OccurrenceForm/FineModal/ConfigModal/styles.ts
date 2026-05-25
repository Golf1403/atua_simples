import {
  colorbabyponder,
  coloraero,
  colorfine,
  colorgray80,
  colorstategray,
  fontmd,
  fontsm,
  rem,
} from '@/styles/global';
import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.12);
`;

export const Dialog = styled.div`
  width: ${rem(468)};
  min-height: ${rem(300)};
  border: 1px solid #d0d0d0;
  border-left: 4px solid ${colorfine};
  background: ${colorbabyponder};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: ${rem(39)};
  padding: 0 ${rem(6)} 0 ${rem(8)};
  border-bottom: 1px solid #d8d8d8;
`;

export const Title = styled.div`
  flex: 1;
  color: #000;
  font-size: ${rem(14)};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${rem(6)};
`;

export const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${rem(27)};
  height: ${rem(27)};
  border: 1px solid #c5c5c5;
  border-radius: ${rem(3)};
  background: ${colorgray80};
  color: ${colorstategray};
  cursor: pointer;

  svg {
    font-size: ${rem(18)};
  }

  &:hover {
    border-color: ${coloraero};
    color: ${coloraero};
  }
`;

export const ApplyPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(20)};
  min-height: ${rem(255)};
  margin: ${rem(4)};
  padding: ${rem(9)} ${rem(30)};
  background: #efefef;
`;

export const ApplyTitle = styled.div`
  color: ${colorstategray};
  font-size: ${fontsm};
  font-weight: 700;
  text-transform: uppercase;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${rem(10)};
  color: ${colorstategray};
  font-size: ${fontmd};
`;

export const Checkbox = styled.input`
  width: ${rem(15)};
  height: ${rem(15)};
  margin: 0;
`;
