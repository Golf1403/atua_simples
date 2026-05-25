import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import {
  ButtonActionDefault,
  coloraero,
  colorbabyponder,
  colorstategray,
  desktopxxl,
  fontmd,
  fontsm,
  fontxl,
  rem,
} from '@/styles/global';
import { Form as FormikForm } from 'formik';
import styled, { css } from 'styled-components';

export const Form = styled(FormikForm)``;

export const Tooltip = styled(DefaultTooltip)``;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: ${fontsm};
  padding-bottom: ${rem(2)};
`;

export const AuthorListContainer = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: ${fontxl};
  }
`;

export const LabelName = styled.label`
  padding-left: ${rem(48)};
`;

export const AuthorName = styled.div`
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
`;

export const AuthorCount = styled.div`
  border: 0;
  position: absolute;
  font-size: ${fontmd};
  left: ${fontxl};
  top: 0;
  height: 100%;
  z-index: 3;
  color: ${colorstategray};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AuthorAction = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: ${rem(8)};
  width: ${rem(70)};

  svg {
    font-size: ${rem(24)};
    padding-right: ${rem(4)};

    @media (max-width: ${desktopxxl}) {
      font-size: ${rem(16)};
      padding-right: 1px;
    }
  }

  label {
    width: 100%;
    text-align: center;
  }
`;

export const BackgroudContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${rem(12)};
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.1875rem;
  background-color: ${colorbabyponder};
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  min-width: ${rem(64)};
  align-items: center;
  height: ${rem(35)};
`;

export const ButtonAction = styled(ButtonActionDefault)`
  &:focus {
    background: ${coloraero};
  }
`;

export const InputContainer = styled.div`
  select {
    color: ${colorstategray};
    padding-left: ${rem(48)};
  }
  svg {
    font-size: ${rem(24)};
  }
`;

export const TabContainer = styled.div<{ $visibility: boolean }>`
  ${props =>
    props.$visibility &&
    css`
      margin: ${rem(48)} 0 0 ${rem(48)};
    `}
`;

export const VerticalLine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  margin-right: ${fontxl};
  border-left: ${rem(8)} solid ${coloraero};
  height: 100%;
  z-index: 3;
`;

export const Input = styled(DefaultInput)`
  &:focus {
    border-color: ${coloraero};
  }
`;
