import { fontmd, fontxs } from '@/styles/global';
import { styled } from 'styled-components';

export const Label = styled.label`
  padding-left: ${fontxs};
  font-size: ${fontmd};
`;
export const Input = styled.input<{ $size: string }>`
  width: ${props => (props.$size ? props.$size : '15px')};
  height: ${props => (props.$size ? props.$size : '15px')};
`;

export const Container = styled.div``;
