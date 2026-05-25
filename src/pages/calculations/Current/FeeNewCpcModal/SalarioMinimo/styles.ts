import DefaultInput from '@/components/DefaultInput';
import { coloraero, colorblack, colorstategray, fontlg, fontmd, fontsm, fontxs, rem } from '@/styles/global';
import styled from 'styled-components';

export const Input = styled(DefaultInput)``;
export const Container = styled.div`
  padding-top: ${rem(16)};
`;

export const Title = styled.div`
  font-size: ${fontmd};
  font-weight: bold;
  color: ${colorblack};

  &.table {
    margin: 0 ${rem(8)};
    color: ${colorstategray};
  }
`;

export const Content = styled.div`
  min-width: ${rem(720)};
  width: 100%;
  min-height: ${rem(300)};
  height: 100%;
  border: 1px solid ${coloraero};
  border-radius: 5px;
`;

export const Data = styled.div`
  display: flex;
  padding: ${rem(4)};
`;

export const Table = styled.div`
  margin: ${rem(4)} ${rem(12)};
`;
export const Line = styled.div`
  display: flex;
  align-items: center;
  font-size: ${fontmd};
  padding-bottom: 5px;
  gap: 20px;
`;

export const Header = styled(Line)`
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: ${rem(16)};
`;

export const DataResult = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const BorderContainer = styled.div`
  border-left: 1px solid ${colorstategray};
  margin-left: ${rem(16)};
  padding-left: ${rem(8)};
  height: 50%;
`;

export const DataChildren = styled.div`
  min-width: ${rem(250)};
  width: 100%;
  font-size: ${fontmd};
  color: ${colorstategray};
  &:last-child {
    font-weight: bold;
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${coloraero};
  margin: 0 ${rem(8)};
`;

export const Footer = styled.div`
  display: flex;
  position: relative;
  font-weight: bold;
  height: ${rem(16)};
`;

export const TotalTitle = styled.p`
  position: absolute;
  bottom: ${rem(0)};
  left: ${rem(6)};
  font-size: ${fontmd};
  color: ${colorstategray};
`;

export const TotalValue = styled.p`
  position: absolute;
  bottom: ${rem(0)};
  right: ${rem(6)};
  font-size: ${fontmd};
`;

export const Column = styled.div`
  width: ${rem(150)};
  padding-left: ${rem(6)};

  &:first-child {
    flex: 1;
  }
  &:nth-child(3) {
    width: ${rem(90)};
    text-align: center;
  }

  &:nth-child(4) {
    text-align: right;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-transform: uppercase;
  padding-top: ${rem(8)};
  font-size: ${fontsm};
`;

export const CheckboxContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${rem(10)} ${rem(10)};

  label {
    font-size: ${fontlg};
    text-align: center;
  }
  .checkbox-container {
    display: flex;
    align-items: center;
  }
`;

export const CheckboxLabel = styled.label`
  padding-left: ${fontxs};
  text-transform: uppercase;
  font-size: ${fontsm};
`;

export const DateContainer = styled.div`
  width: ${rem(200)};
  padding-left: ${rem(8)};
`;
export const InputContainer = styled.div`
  width: ${rem(200)};
  padding-left: ${rem(8)};
`;
