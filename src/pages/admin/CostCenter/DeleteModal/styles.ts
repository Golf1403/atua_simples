import DefaultInput from '@/components/DefaultInput';
import { colorred, rem } from '@/styles/global';
import { Form } from 'formik';
import { styled } from 'styled-components';

export const Input = styled(DefaultInput)``;

export const Container = styled.div`
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
  color: ${colorred};
  min-width: ${rem(600)};
  width: 100%;
  min-height: ${rem(120)};
  height: 100%;
  padding: ${rem(16)};
`;
