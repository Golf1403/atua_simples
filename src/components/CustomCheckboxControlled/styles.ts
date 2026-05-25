import { rem } from '@/styles/global';
import styled from 'styled-components';

export const Label = styled.label`
  display: --webkit-flex;
  display: flex;
  --webkit-flex-wrap: wrap;
  align-items: center;
  padding-left: ${rem(8)};
  padding-top: ${rem(16)};
`;
export const ErrorContainer = styled.span``;
export const Text = styled.span`
  padding-left: ${rem(8)};
`;
export const Input = styled.input`
  height: 20px;
  width: 20px;
  font-size: 50px;
`;
