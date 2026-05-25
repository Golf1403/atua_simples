import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import { colorblack, fontmd, rem } from '@/styles/global';
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
  height: ${rem(160)};
  width: 100%;
`;
export const InputDate = styled(DefaultDateInput)``;
export const Input = styled(DefaultInput)``;
export const IndexInfo = styled.div`
  color: ${colorblack};
  text-align: end;
  font-size: ${fontmd};
`;
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
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  height: 100%;
  width: calc(50% - ${rem(128)});
  &:nth-child(2) {
    margin-left: ${rem(128)};
  }
`;
