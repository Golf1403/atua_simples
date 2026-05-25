import ButtonDefault from '@/components/ButtonDefault';
import DefaultInput from '@/components/DefaultInput';
import { rem } from '@/styles/global';
import { Formik, Form as FormikForm } from 'formik';
import { styled } from 'styled-components';

export const Form = styled(FormikForm)`
  padding: ${rem(8)};
  width: ${rem(500)};
  div + div {
    padding-bottom: ${rem(8)};
  }
`;

export const Link = styled.a`
  position: absolute;
  right: ${rem(8)};
  padding-top: ${rem(8)};
`;

export const InputContainer = styled.div`
  width: ${rem(300)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  position: relative;
`;
export const CostCenterContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;
  height: ${rem(32)};
`;
export const ButtonContainer = styled.div`
  position: absolute;
  right: 0;
  width: ${rem(32)};
  height: ${rem(32)};
`;
export const Button = styled(ButtonDefault)``;
export const Container = styled(Formik)``;
export const Input = styled(DefaultInput)``;
