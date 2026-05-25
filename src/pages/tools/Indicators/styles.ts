import DefaultDateInput from '@/components/DefaultDateInput';
import {
  ButtonActionDefault,
  ButtonDefault,
  coloraero,
  colorblack,
  colorsfinancing,
  colorwhite,
  coloryellowgreen,
  fontmd,
  rem,
} from '@/styles/global';
import { Form as FormikForm, Formik } from 'formik';
import { styled } from 'styled-components';

export const FormikContainer = styled(Formik)``;

export const Form = styled(FormikForm)`
  margin: 0;
  padding: 0;
  width: 38%;
`;

export const SelectContainer = styled.div`
  width: 100%;
  margin-right: ${rem(8)};
`;
export const FlexContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;

  .date-start {
    margin-right: ${rem(4)};
  }

  .date-end {
    margin-left: ${rem(4)};
  }
`;
export const Separator = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: flex-end;
  width: 100%;

  & {
    margin-bottom: ${rem(24)};
  }
`;
export const FilterContent = styled.div`
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
`;

export const FilterHeader = styled.div`
  border: 1px solid ${coloraero};
  padding: ${rem(16)};
  width: 100%;
  margin-bottom: ${rem(8)};
`;
export const FilterContainer = styled.div`
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
`;

export const Filter = styled.div<{ $active?: boolean; $index: number }>`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  width: 100%;

  color: ${colorwhite};
  margin-top: ${rem(4)};

  div {
    width: 100%;
    background-color: ${props => colorsfinancing[props.$index]};
    border: ${rem(2)} solid ${props => (props.$active ? (props.$index == 5 ? colorsfinancing : colorblack) : '')};
  }

  svg {
    color: ${coloryellowgreen};
    margin-right: ${rem(8)};
    margin-left: ${rem(2)};
  }

  p {
    width: 100%;
    padding: ${rem(4)} ${rem(16)} ${rem(4)} ${rem(16)};
    cursor: pointer;
  }
`;

export const FilterLabel = styled.label`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  padding-bottom: ${rem(20)};
`;

export const ButtonSearch = styled(ButtonActionDefault)`
  height: 100%;
  width: 100%;
  svg {
    font-size: ${rem(40)};
  }
`;

export const Button = styled(ButtonDefault)``;

export const InputContainer = styled.div`
  div + div {
    margin-bottom: ${rem(8)};
  }
`;

export const InputDate = styled(DefaultDateInput)``;

export const ButtonContainer = styled.div`
  height: ${rem(40)};
  width: ${rem(40)};
`;

export const Container = styled.div`
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

export const ChartContainer = styled.div<{ $visibility: boolean }>`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 60%;
  visibility: ${props => (props.$visibility ? 'visible' : 'hidden')};
`;

export const ChartLabel = styled.label`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  font-weight: bold;
  font-size: ${fontmd};
  color: ${coloraero};
  border-bottom: ${rem(1)} solid ${coloraero};
  padding-bottom: ${rem(4)};
  margin-bottom: ${rem(8)};
`;
export const Chart = styled.div`
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
  width: 90%;
  max-height: ${rem(400)};
  height: 90%;
`;
