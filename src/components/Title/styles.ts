import { coloraero, colorwhite, fontlg, fontxl, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.button`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  background-color: ${coloraero};
  color: ${colorwhite};
  width: 100%;
  border-radius: ${rem(50)};
  padding: 0 ${rem(10)};
  height: 100%;
  cursor: pointer;
`;

export const Text = styled.span`
  color: ${colorwhite};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  font-size: ${fontlg};
  font-weight: bold;
  height: 100%;
  margin-left: ${rem(8)};
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  justify-content: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
