import { coloraero, fontxl, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  width: ${rem(500)};
  height: ${rem(500)};
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
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
`;
export const Title = styled.h1`
  margin-bottom: ${rem(48)};
  font-size: ${rem(40)};
  color: ${coloraero};
`;
export const Text = styled.p`
  color: ${coloraero};
  font-size: ${fontxl};
  margin-bottom: ${rem(8)};
`;
