import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultInput from '@/components/DefaultInput';
import { LabelContainer as DefaultLabelContainer, Label as DefaultLabel } from '@/components/DefaultInput/styles';
import DefaultTooltip from '@/components/DefaultTooltip';
import { colorbabyponder, fontmd, rem } from '@/styles/global';
import { Form } from 'formik';
import { styled } from 'styled-components';

export const Container = styled(Form)`
  width: 100%;
`;
export const Input = styled(DefaultInput)``;

export const Tooltip = styled(DefaultTooltip)``;

export const Content = styled.div`
  padding-right: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  .positive {
    margin-right: ${rem(4)};
  }
  .purges {
    margin-left: ${rem(4)};
  }
`;

export const CustomSelectContainer = styled.div`
  .tooltip-container {
    display: block !important;
  }
  min-width: 92%;
  width: 100%;
  max-width: 92%;
`;
export const CustomCheckboxContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;

  padding-right: ${rem(8)};
  width: 100%;
  min-width: ${rem(200)};
  max-width: ${rem(300)};
`;

export const Footer = styled.div`
  width: 100%;
  min-width: ${rem(200)};
  max-width: ${rem(300)};
`;

export const InputDate = styled(DefaultDateInput)``;

export const FormRow1 = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const FormRow2 = styled.div`
  margin-top: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const FormRow3 = styled.div`
  margin-top: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  width: 100%;
  .record-id {
    margin-left: ${rem(4)};
  }
  .court-id {
    margin-right: ${rem(4)};
  }
`;

export const FormRow4 = styled.div`
  margin-top: ${rem(8)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  width: 100%;
  .observation {
    margin-left: ${rem(4)};
  }
  .defendant-id {
    margin-right: ${rem(4)};
  }
`;
export const ProRata = styled.div`
  display: flex;
  align-items: center;
  padding: ${rem(8)} ${rem(8)};
  gap: ${fontmd};
  border-radius: 0.1875rem;
  background-color: ${colorbabyponder};
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

export const LabelContainer = styled(DefaultLabelContainer)`
  display: flex;
  justify-content: space-between;
  font-size: ${rem(10)};
  margin-bottom: ${rem(4)};

  &:first-child {
    padding-top: ${rem(8)};
  }

  .tooltip-container {
    display: block !important;
    max-width: ${rem(16)};
  }

  svg {
    height: ${rem(12)};
  }

  font-size: ${rem(10)};
  margin-bottom: ${rem(4)};
`;
export const Label = styled(DefaultLabel)``;
