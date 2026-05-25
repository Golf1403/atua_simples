import DefaultInput from '@/components/DefaultInput';
import DefaultDateInput from '@/components/DefaultDateInput';
import { colorblack, fontmd, rem } from '@/styles/global';
import { Form as FormDefault } from 'formik';
import { styled } from 'styled-components';
import DefaultTooltip from '@/components/DefaultTooltip';
import CustomCheckbox from '@/components/CustomCheckbox';

export const CheckBoxContainer = styled.div`
  margin-left: ${rem(8)};
  margin-bottom: ${rem(16)};
`;
export const CheckBox = styled(CustomCheckbox)``;
export const Tooltip = styled(DefaultTooltip)``;
export const DateInput = styled(DefaultDateInput)``;
export const Input = styled(DefaultInput)``;
export const Form = styled(FormDefault)``;

export const DateContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: ${rem(180)};
  min-height: ${rem(100)};
  margin-left: ${rem(8)};
`;

export const IndexInfo = styled.div`
  color: ${colorblack};
  text-align: end;
  font-size: ${fontmd};
`;

export const ValueContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: ${rem(400)};
  min-height: ${rem(100)};
  margin-left: ${rem(8)};
`;
export const IndexContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  flex-direction: column;
  gap: ${rem(5)};
`;

export const InlineFlex = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;

  label {
    font-size: ${fontmd};
  }
`;

export const Wrapper = styled.div`
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
  padding: ${rem(24)};
  width: 100%;
  height: 100%;
`;
