import DefaultInput from '@/components/DefaultInput';
import { rem } from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

export const Container = styled(Formik)``;
export const Form = styled(FormikForm)`
  padding: ${rem(10)};
`;
export const Input = styled(DefaultInput)``;
export const InputContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  &:first-child {
    margin-bottom: ${rem(40)};
  }
  width: calc(100% - ${rem(24)});
  div + div,
  label {
    margin-left: ${rem(16)};
  }
`;
