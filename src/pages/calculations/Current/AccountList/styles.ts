import { ButtonActionDefault, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
`;
export const Button = styled(ButtonActionDefault)``;

export const Search = styled.div`
  display: flex;
  width: ${rem(400)};
`;

export const ButtonSearch = styled(ButtonActionDefault)`
  height: 100%;
  width: ${rem(40)};
  svg {
    font-size: ${rem(40)};
  }
`;
