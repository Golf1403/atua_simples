import { ButtonDefault, coloraero, colorstategray, fontxl, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  height: ${rem(32)};
  width: 100%;

  button + button {
    margin-left: ${rem(8)};
  }
  div + div,
  button + div,
  div + button {
    margin-left: ${rem(16)};
  }
`;

export const Button = styled(ButtonDefault)`
  :first-child {
    display: -webkit-flex;
    display: flex;
    align-items: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
  }
  width: ${rem(32)};
  height: 100%;
  &:first-child {
    margin-left: -${rem(8)};
  }
`;

export const Separator = styled.div`
  color: ${colorstategray};
  font-size: ${fontxl};
`;

export const PageNumber = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  color: ${colorstategray};
  font-size: ${fontxl};
`;
