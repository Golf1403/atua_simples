import DefaultInput from '@/components/DefaultInput';
import { ButtonActionDefault, fontmd, rem } from '@/styles/global';
import { Form } from 'formik';
import { styled } from 'styled-components';

export const Input = styled(DefaultInput)``;

export const InputContainer = styled.div`
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
  align-items: center;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  width: 100%;
`;

export const Container = styled(Form)`
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
  align-items: center;
  min-width: ${rem(600)};
  width: 100%;
  min-height: ${rem(400)};
  height: 100%;
  padding: ${rem(16)};
`;
export const NameContainer = styled.div`
  width: 100%;
`;
export const DateInputContainer = styled.div`
  margin-top: ${rem(16)};
  margin-bottom: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  :first-child {
    margin-right: ${rem(8)};
  }
`;

export const ButtonSearch = styled(ButtonActionDefault)`
  display: flex;
  height: ${rem(64)};
  width: 50px;
  svg {
    font-size: ${rem(40)};
  }
`;

export const TotalLabels = styled.div`
  position: absolute;
  bottom: ${rem(24)};
  p {
    font-size: ${fontmd};
  }
`;
