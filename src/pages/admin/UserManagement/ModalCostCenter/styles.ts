import { rem } from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

export const Container = styled(Formik)``;
export const Form = styled(FormikForm)`
  padding: ${rem(8)};
  width: 100%;
`;
