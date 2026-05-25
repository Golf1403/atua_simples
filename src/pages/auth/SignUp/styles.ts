import { colorbabyponder, colorblack, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

export const Container = styled.div``;

export const NavTab = styled.div<{ isActive: boolean }>`
  min-height: 100vh;
  display: flex;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease-in-out;

  ${({ isActive }) =>
    !isActive &&
    css`
      display: none;
    `}
`;

export const FormContainer = styled.div`
  background-color: ${colorbabyponder};
  border-radius: 8px;
  min-width: ${rem(600)};
  min-height: ${rem(300)};
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;
