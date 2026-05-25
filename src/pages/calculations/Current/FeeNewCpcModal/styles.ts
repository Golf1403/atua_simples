import DefaultInput from '@/components/DefaultInput';
import { coloraero, colorblack, colorstategray, fontlg, fontmd, rem } from '@/styles/global';
import { Form } from 'formik';
import styled from 'styled-components';

export const Input = styled(DefaultInput)``;
export const Container = styled(Form)`
  min-width: ${rem(800)};
  width: 100%;
  min-height: ${rem(625)};
  height: 100%;
  position: relative;
`;

export const Footer = styled.div`
  display: flex;
  position: relative;
  font-weight: bold;
  color: ${colorblack};
  height: ${rem(30)};
  margin-bottom: ${rem(16)};
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
  display: flex;
  align-items: center;
  min-height: ${rem(86)};
  width: 100%;
  height: 100%;
  border: 1px solid ${coloraero};
  border-radius: 5px;
`;

export const TotalTitle = styled.p`
  text-transform: uppercase;
  position: absolute;
  bottom: ${rem(0)};
  left: ${rem(6)};
  font-size: ${fontlg};
`;

export const TotalValue = styled.p`
  position: absolute;
  bottom: ${rem(0)};
  right: ${rem(6)};
  font-size: ${fontlg};
`;
export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  color: ${colorblack};
  font-size: ${fontmd};
  font-weight: bold;
`;
export const CheckboxContent = styled.div`
  display: flex;
  gap: ${rem(16)};
  align-items: center;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(16)};
  width: ${rem(250)};
  padding-left: ${rem(8)};
`;

export const Text = styled.p`
  font-weight: normal;
`;

export const MainCalc = styled.div`
  padding-top: ${rem(16)};
  display: flex;
  flex-direction: column;
`;
