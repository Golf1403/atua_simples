import { fontmd, rem, coloraero, fontlg } from '@/styles/global';
import styled from 'styled-components';
import DefaultInput from '../DefaultInput';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: ${rem(250)};
`;

export const Label = styled.label<{ color?: boolean }>`
  margin-top: ${rem(8)};
  font-size: ${props => (props.color ? fontlg : fontmd)};
  font-weight: ${props => props.color && 'bold'};
  text-transform: ${props => props.color && 'uppercase'};
`;

export const Select = styled.div`
  padding: ${rem(8)};
  max-height: ${rem(70)};
  overflow-y: scroll;
  width: ${rem(200)};
  overflow-x: scroll;
  border: 1px solid ${coloraero};
  option:hover {
    background-color: ${coloraero};
    color: white;
  }
`;

export const InputColor = styled(DefaultInput)`
  margin-top: 5px;
  padding: 5px;
  width: ${rem(50)};
  height: ${rem(30)};
  margin-right: ${rem(8)};
`;

interface ExampleProps {
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontColor: string;
  fontStyleCheck: string;
}

export const Example = styled.div<ExampleProps>`
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize}px;
  font-weight: ${props => (props.fontStyle.includes('Bold') ? 'bold' : 'normal')};
  font-style: ${props => (props.fontStyle.includes('Italic') ? 'italic' : 'normal')};
  text-decoration: ${props => props.fontStyleCheck};
  color: ${props => props.fontColor};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: ${rem(108)};
`;
export const UpperContent = styled.div`
  display: flex;
  gap: ${rem(8)};
`;

export const LowerContent = styled.div`
  display: flex;
  gap: ${rem(8)};
  margin-top: ${rem(8)};
`;

export const ColumnContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LineContent = styled.div`
  display: flex;
  align-items: center;
`;

export const EffectContent = styled.div`
  width: ${rem(200)};
`;

export const ViewerContent = styled.div`
  width: ${rem(408)};
`;

export const Border = styled.div`
  padding: ${rem(8)};
  border: 1px solid ${coloraero};
`;

export const CustomCheckboxContainer = styled.div`
  margin-bottom: ${rem(8)};
`;

export const BorderContent = styled.div`
  height: ${rem(108)};
`;
