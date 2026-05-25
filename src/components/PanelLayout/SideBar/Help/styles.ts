import { coloraero, colorlightstategray, fontlg } from '@/styles/global';
import { fontxl } from '@/styles/global';
import { rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  min-height: 100%;
  min-width: ${rem(280)};
`;
export const Content = styled.div``;
export const Title = styled.div`
  color: ${coloraero};
  font-size: ${rem(16)};
  font-weight: 700;
  margin-top: 1.875rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  svg {
    margin-right: ${rem(8)};
  }
`;
export const Link = styled.a<{ $active: boolean }>`
  color: ${props => (props.$active ? coloraero : colorlightstategray)};
  font-weight: ${props => (props.$active ? 'bold' : 'normal')};
  cursor: pointer;
  display: block;
  font-size: ${fontxl};
  text-indent: ${rem(24)};
  margin-top: 0.625rem;
  text-decoration: none;
  width: 100%;
  &:hover {
    color: ${coloraero};
    font-weight: bold;
  }
`;
export const LinkContainer = styled.div`
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
