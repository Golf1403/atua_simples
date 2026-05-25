import { css, styled } from 'styled-components';
import {
  InputContainer as DefaultInputContainer,
  Container as DefaultContainer,
  LabelContainer as DefaultLabelContainer,
  Label as DefaultLabel,
  ContainerProps,
} from '@components/DefaultInput/styles';
import { coloraero, colorbabyponder, colorblue, colordisabled, rem } from '@/styles/global';

export const Container = styled(DefaultContainer)`
  label {
    ${(props: ContainerProps) =>
      props.$focus &&
      css`
        border-color: ${colorbabyponder};
        color: ${coloraero};
        font-weight: bold;
      `}

    ${(props: ContainerProps) =>
      props.$fill &&
      css`
        font-weight: bold;
        color: ${coloraero};
      `}
  }
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
`;
export const Label = styled(DefaultLabel)``;

export const InputContainer = styled(DefaultInputContainer)`
  position: relative;
  svg {
    position: absolute;
    right: 2px;
  }
  select {
    font-size: ${rem(12)};
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.1875rem;
    padding: ${rem(10)} ${rem(10)};
    background-color: ${colorbabyponder};
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &:disabled {
      background-color: ${colordisabled};
      border: 1px solid ${colordisabled};
    }
    &:focus {
      border: 1px solid ${colorblue};
    }
  }

  .icon {
    pointer-events: none;
  }
`;
