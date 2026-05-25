import { colorblack, colorerror, colorsuccess, colorwarning, colorwhite, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

interface ContainerProps {
  $type?: 'success' | 'error' | 'info';
  $hasDescription: boolean;
}

const toastTypeVariations = {
  info: css`
    background: ${colorwarning};
    color: ${colorblack};
  `,
  success: css`
    background: ${colorsuccess};
    color: ${colorwhite};
  `,
  error: css`
    background: ${colorerror};
    color: ${colorblack};
  `,
};

export const Container = styled.div<ContainerProps>`
  width: 360px;

  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: ${rem(2)} ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.2);

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;

  & + div {
    margin-top: 8px;
  }

  ${(props: ContainerProps) => toastTypeVariations[props.$type || 'info']}

  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    -webkit-box-flex: 1;
    -moz-flex: 1;
    -webkit-flex: 1;
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 19px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }

  ${(props: ContainerProps) =>
    !props.$hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
