import DefaultInput from '@/components/DefaultInput';
import { rem } from '@/styles/global';
import { Form as FormikForm } from 'formik';
import styled from 'styled-components';

export const Input = styled(DefaultInput)``;
export const Form = styled(FormikForm)`
  padding-top: ${rem(4)};
  margin-right: ${rem(4)};
  :first-child {
    margin-bottom: ${rem(4)};
  }
`;
