import { coloraero, colorwhite, rem } from '@/styles/global';
import styled from 'styled-components';
import { Formik, Form as FormikForm } from 'formik';
import DefaultInput from '@/components/DefaultInput';

export const Container = styled(Formik)``;

export const FormContainer = styled.div`
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
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

export const Form = styled(FormikForm)`
  width: ${rem(256)};
`;

export const InputContainer = styled.div`
  margin-bottom: ${rem(8)};
`;

export const Input = styled(DefaultInput)``;

export const LinkContainer = styled.div`
  text-align: center;
`;

export const Button = styled.button`
  margin-top: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  background-color: ${coloraero};
  width: 100%;
  height: ${rem(40)};
  cursor: pointer;
  color: ${colorwhite};

  &:hover {
    background-color: rgba(61, 171, 255, 0.57);
  }
`;
