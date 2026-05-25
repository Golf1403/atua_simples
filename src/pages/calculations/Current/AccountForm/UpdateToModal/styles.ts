import { fontlg, rem } from '@/styles/global';
import styled from 'styled-components';

export const Container = styled.div`
  padding: ${rem(15)} ${rem(15)};
  width: ${rem(500)};
`;

export const Paragraph = styled.p`
  font-size: ${fontlg};
`;
