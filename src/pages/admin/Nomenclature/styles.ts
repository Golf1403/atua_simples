import DefaultInput from '@/components/DefaultInput';
import { ButtonDefault, rem } from '@/styles/global';
import { Formik, Form as FormikForm } from 'formik';
import { styled } from 'styled-components';

export const Button = styled(ButtonDefault)``;

export const InputContainer = styled.div`
  width: ${rem(300)};
`;

export const SelectContainer = styled.div`
  width: ${rem(300)};
`;
export const ButtonContainer = styled.div`
  display: flex;
  width: ${rem(30)};
  height: ${rem(30)};
  margin-right: ${rem(25)};
  margin-top: ${rem(25)};
`;

export const Input = styled(DefaultInput)``;

export const Container = styled(Formik)``;

export const Form = styled(FormikForm)``;

export const FormHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const JustifyCenter = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  height: ${rem(64)};
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
`;
