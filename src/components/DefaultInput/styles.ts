import styled, { css } from 'styled-components';
import Tooltip from '../DefaultTooltip';
import { coloraero, colordisabled, colorblueE8, colororangered, fontmd, colorblue } from '@/styles/global';

import { rem } from '@/styles/global';
import { colorbabyponder } from '@/styles/global';

export interface ContainerProps {
  $focus?: boolean;
  $fill?: boolean;
  $error?: boolean;
}

export const Container = styled.div<ContainerProps>`
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
  width: 100%;

  input {
    padding: ${rem(10)} ${rem(10)};
    &:focus {
      background-color: ${colorblueE8};
      border: 1px solid ${colorblue};
    }
  }

  ${(props: ContainerProps) =>
    props.$error &&
    css`
      border-color: ${colororangered};
    `}

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
`;

export const Error = styled(Tooltip)`
  height: 20px;
`;

export const LabelContainer = styled.div<ContainerProps>`
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

export const Row = styled.div<{ $iconPosition: 'left' | 'right' }>`
  position: absolute;
  cursor: pointer;
  ${props =>
    props.$iconPosition == 'right'
      ? css`
          right: ${rem(4)};
        `
      : css`
          left: ${rem(4)};
        `};
`;

export const InputContainer = styled.div<{ $iconPosition: 'left' | 'right' }>`
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  width: 100%;

  input {
    font-size: ${rem(12)};
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.1875rem;
    background-color: ${colorbabyponder};
    width: 100%;
    ${props =>
      props.$iconPosition == 'left' &&
      css`
        padding-left: ${rem(32)};
      `};

    &:disabled,
    &:read-only {
      background-color: ${colordisabled};
      border: 1px solid ${colordisabled};
    }
  }

  .icon-pass {
    display: -webkit-flex;
    display: flex;
    position: absolute;
    right: ${rem(24)};
    align-items: center;
    pointer-events: pointer;
  }
`;

export const Label = styled.label``;

export const Input = styled.input`
  width: 100%;
`;
