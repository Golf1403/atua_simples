import { css, styled } from 'styled-components';
import DefaultInput from '@components/DefaultInput';
import { colorblue, colorblueE8, rem } from '@/styles/global';
import {
  ContainerProps,
  Container as DefaultContainer,
  InputContainer as DefaultInputContainer,
  LabelContainer as DefaultLabelContainer,
} from '../DefaultInput/styles';

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

export const Label = styled.label``;

export const InputContainer = styled(DefaultInputContainer)`
  position: relative;
  svg {
    ${props =>
      props.$iconPosition == 'right'
        ? css`
            right: ${rem(4)};
          `
        : css`
            left: ${rem(4)};
          `};
    left: ${props => props.$iconPosition == 'left' && 0};
    position: absolute;
  }
  &:focus {
    background-color: ${colorblueE8};
    border: 1px solid ${colorblue};
  }
`;

export const Container = styled(DefaultContainer)<ContainerProps & { $showCalendar: boolean }>`
  position: relative;

  &:focus-within {
    z-index: 10001;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
    input {
      width: 100%;
      border-radius: 4px;
      outline: none;
    }
  }

  .react-datepicker-popper {
    z-index: 10000;
  }

  label {
    ${(props: ContainerProps) =>
      props.$focus &&
      css`
        font-weight: bold;
      `}

    ${(props: ContainerProps) =>
      props.$fill &&
      css`
        font-weight: bold;
      `}
  }
`;

export const Input = styled(DefaultInput)`
  padding: ${rem(4)};
`;
