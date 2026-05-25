import ButtonDefault from '@/components/ButtonDefault';
import DefaultInput from '@/components/DefaultInput';
import { ButtonActionDefault, rem } from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

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
export const ButtonAction = styled(ButtonActionDefault)``;
export const ButtonContainer = styled.div`
  height: ${rem(32)};
  width: ${rem(32)};
  position: absolute;
  right: 0;
`;
export const Input = styled(DefaultInput)``;
export const ButtonAdd = styled(ButtonDefault)``;
export const Container = styled(Formik)``;
export const Form = styled(FormikForm)`
  padding: ${rem(8)};
  width: ${rem(400)};
  padding: ${8};

  div + div {
    padding-bottom: ${rem(8)};
  }
`;
