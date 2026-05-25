import DefaultInput from '@/components/DefaultInput';
import { rem } from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

export const Container = styled(Formik)``;
export const Form = styled(FormikForm)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  width: 100%;
`;

export const Input = styled(DefaultInput)``;

export const Separator = styled.div`
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
  height: ${rem(256)};
`;
