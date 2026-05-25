import { rem } from '@/styles/global';
import { Form as FormikForm } from 'formik';
import { styled } from 'styled-components';

export const Container = styled(FormikForm)`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  div + div {
    padding-left: ${rem(80)};
  }

  label {
    padding-left: ${rem(8)};
  }

  .tooltip-content {
    width: ${rem(350)};
  }

  div:focus {
    background-color: black;
  }
`;
export const TooltipTContainer = styled.div`
  padding: ${rem(16)} 0 ${rem(16)};
  .tooltip-content {
    width: ${rem(200)};
  }
`;
