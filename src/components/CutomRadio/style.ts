import styled, { css } from 'styled-components';
import { ContainerProps } from '../DefaultInput/styles';
import { coloraero, colorbabyponder } from '@/styles/global';

export const Container = styled.div<ContainerProps>`
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
