import { ButtonActionDefault, coloraero, colorblack, rem } from '@/styles/global';
import { css, styled } from 'styled-components';

export const Container = styled.div<{ $visibility: boolean }>`
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
  min-width: ${rem(350)};
  width: 100%;
  visibility: ${$props => ($props.$visibility ? 'visible' : 'hidden')};
  margin-right: ${rem(32)};
`;

export const ButtonAction = styled(ButtonActionDefault)<{ isSelected?: boolean }>`
  width: ${rem(30)};
  height: ${rem(30)};
  border: 1px solid ${coloraero};
  svg {
    font-size: ${rem(20)};
  }

  ${props =>
    props.isSelected &&
    css`
      color: ${colorblack};
    `}
`;
