import { colorbabyblue, colorblue, colorred, colorwhite, fontlg, rem } from '@/styles/global';
import styled from 'styled-components';

export const Container = styled.div`
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
`;

export const Button = styled.div<{ expiredPlan?: boolean }>`
  cursor: pointer;
  position: relative;
  width: ${rem(150)};
  height: ${rem(30)};
  border-radius: ${rem(50)};
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => (props.expiredPlan ? colorred : colorblue)};

  svg {
    color: ${colorwhite};
    font-size: ${rem(24)};
    position: absolute;
    left: ${rem(8)};
  }
`;

export const Text = styled.p`
  color: ${colorwhite};
  font-size: ${rem(16)};
  position: absolute;
  left: ${rem(40)};
`;

export const Title = styled.p`
  position: absolute;
  left: ${rem(8)};
  font-size: ${fontlg};
`;

export const NumberInfo = styled.p`
  position: absolute;
  right: ${rem(8)};
  font-size: ${fontlg};
`;

export const DropdownItem = styled.a<{ isExp?: boolean }>`
  position: relative;
  font-weight: bold;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => (props.isExp ? colorred : colorblue)};
  cursor: default;
  margin: ${rem(6)} ${rem(4)};
  background-color: #f9f9f9;
  border-radius: ${rem(8)};

  &:hover {
    background-color: ${colorbabyblue};
  }
`;
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props: { $isOpen: boolean }) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #d4e3f1;
  min-width: ${rem(200)};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;
