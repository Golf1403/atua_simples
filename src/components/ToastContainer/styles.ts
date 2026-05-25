import styled, { keyframes } from 'styled-components';
const slideIn = keyframes`
  from {
    right: -120%;
    opacity: 0;
  }
  to {
    right: 0%;
    opacity: 1;
  }
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  margin-left: 50%;
  padding: 16px;
  overflow: hidden;
  z-index: 21;
`;

export const StyledToast = styled.div<{ $index: number }>`
  animation: ${slideIn} 0.5s ease-in-out ${props => props.$index * 0.2}s both;
`;
