import DefaultInput from '@/components/DefaultInput';
import { coloraero, colorblack, colorstategray, fontlg, fontmd, fontxl, rem } from '@/styles/global';
import styled from 'styled-components';

export const Input = styled(DefaultInput)``;

export const Container = styled.div`
  padding-top: ${rem(16)};
`;

export const Title = styled.div`
  font-size: ${fontmd};
  font-weight: bold;
  color: ${colorblack};
`;

export const Content = styled.div`
  min-width: ${rem(720)};
  width: 100%;
  min-height: ${rem(150)};
  height: 100%;
  border: 1px solid ${coloraero};
  border-radius: 5px;
`;

export const Correction = styled.div`
  display: flex;
`;

export const Interest = styled.div`
  display: flex;
`;

export const DateContainer = styled.div`
  width: ${rem(200)};
  padding-left: ${rem(8)};
`;

export const InputContainer = styled.div`
  width: ${rem(100)};
  padding-left: ${rem(8)};
`;

export const SettingsContainer = styled.div`
  width: ${rem(50)};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  padding-left: ${rem(8)};
  padding-bottom: ${rem(12)};

  svg {
    font-size: ${fontxl};
  }
`;

export const ValueContainer = styled.div`
  padding-left: ${rem(8)};
  flex: 1;
  padding-right: ${rem(8)};
`;

export const SelectContainer = styled.div`
  padding-left: ${rem(8)};
  flex: 1;
  padding-right: ${rem(8)};
`;

export const Footer = styled.div`
  display: flex;
  position: relative;
  font-weight: bold;
  height: ${rem(36)};
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
