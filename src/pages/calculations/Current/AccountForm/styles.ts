import DefaultInput from '@/components/DefaultInput';
import DefaultTooltip from '@/components/DefaultTooltip';
import { coloraero, colorbabyblue, fontlg, rem } from '@/styles/global';
import styled from 'styled-components';

export const CalcDataContainer = styled.div`
  .icon-title {
    font-size: ${rem(24)};
  }
`;

export const CalcClosedContent = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  .icon-title {
    font-size: ${rem(24)};
  }
  .result-icon {
    color: ${coloraero};
    font-size: ${fontlg};
    margin-right: ${rem(8)};
  }
`;

export const AuthorListContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  div + div {
    padding-bottom: ${rem(8)};
  }
  svg {
    font-size: ${rem(16)};
  }
`;

export const Tooltip = styled(DefaultTooltip)``;

export const Input = styled(DefaultInput)`
  &:focus {
    border-color: ${coloraero};
  }
`;

export const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${(props: { $isOpen: boolean }) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

export const DropdownItem = styled.a`
  padding: 12px 16px;
  display: block;
  text-decoration: none;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: ${colorbabyblue};
  }
`;
export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;
