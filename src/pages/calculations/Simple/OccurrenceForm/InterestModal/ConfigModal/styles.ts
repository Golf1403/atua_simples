import {
  colorbabyponder,
  coloraero,
  colorgray80,
  colorinterest,
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
  width: ${rem(560)};
  min-height: ${rem(337)};
  border: 1px solid #d0d0d0;
  border-left: 4px solid ${colorinterest};
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
  grid-template-columns: 1fr ${rem(180)};
  gap: ${rem(12)};
  min-height: ${rem(300)};
  padding: ${rem(6)} ${rem(8)};
`;

export const MainFields = styled.div`
  padding-top: ${rem(6)};
`;

export const Separator = styled.div`
  height: 1px;
  margin: ${rem(26)} 0 ${rem(14)};
  background: #d8d8d8;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${rem(5)};
  color: ${colorstategray};
  font-size: ${fontsm};
  text-transform: uppercase;
`;

export const Select = styled.select`
  height: ${rem(37)};
  border: 1px solid #d0dbe7;
  background: #f8fbff;
  color: ${colorstategray};
  font-size: ${fontmd};
  padding: 0 ${rem(6)};
`;

export const ApplyPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(15)};
  padding: ${rem(18)} ${rem(14)};
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
