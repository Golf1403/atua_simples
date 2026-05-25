import { coloraero, fontxl, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  margin-top: ${rem(16)};
  width: 100%;
  max-width: 99%;

  label,
  input {
    color: ${coloraero};
    font-size: ${fontxl};
    font-weight: bold;
    text-align: end;
  }
`;
export const HorizontalLine = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  -moz-justify-content: flex-end;
  -ms-justify-content: flex-end;
  justify-content: flex-end;
  align-items: baseline;
  width: 80%;
  border-bottom: 1px solid ${coloraero};
  margin-bottom: 10px;
`;
