import DefaultTooltip from '@/components/DefaultTooltip';
import { fontmd } from '@/styles/global';
import styled from 'styled-components';

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CustomCheckboxContainer = styled.div`
  padding-top: ${fontmd};
  padding-left: ${fontmd};
`;

export const Tooltip = styled(DefaultTooltip)``;
