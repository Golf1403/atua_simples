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
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
`;

export const Dialog = styled.div`
  width: ${rem(640)};
  border: 1px solid #d0d0d0;
  border-left: 4px solid ${colorfine};
  background: ${colorbabyponder};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: ${rem(36)};
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

export const Content = styled.div`
  display: grid;
  grid-template-columns: 0.95fr 1fr 1fr 1.05fr 0.75fr;
  gap: ${rem(18)};
  padding: ${rem(14)} ${rem(8)} ${rem(10)};
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${rem(3)};
  color: ${colorstategray};
  font-size: ${fontsm};
  text-transform: uppercase;
`;

export const Select = styled.select`
  height: ${rem(25)};
  border: 1px solid #d9d0e7;
  background: #fdfbff;
  color: ${colorstategray};
  font-size: ${fontmd};
  padding: 0 ${rem(6)};
`;

export const Input = styled.input`
  width: 100%;
  height: ${rem(25)};
  border: 1px solid #d9d0e7;
  background: #fdfbff;
  color: ${colorstategray};
  font-size: ${fontmd};
  padding: 0 ${rem(6)};
  text-align: center;
`;

export const DateInputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(5)};

  svg {
    color: ${colorstategray};
    font-size: ${rem(13)};
  }
`;
