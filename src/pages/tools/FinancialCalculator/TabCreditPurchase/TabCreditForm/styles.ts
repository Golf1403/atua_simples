import DefaultInput from '@/components/DefaultInput';
import { rem } from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

export const Input = styled(DefaultInput)``;
export const Form = styled(FormikForm)`
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
  height: 100%;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  padding: ${rem(10)};
`;
export const Container = styled(Formik)``;
export const InputContainer = styled.div`
  width: calc(100% - ${rem(32)});
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  div + div,
  label {
    margin-left: ${rem(16)};
  }
  div + div {
    margin-bottom: ${rem(16)};
  }
`;
