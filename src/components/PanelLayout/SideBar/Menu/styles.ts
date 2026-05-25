import { coloraero, colorlightstategray, colorwhite, fontmd } from '@/styles/global';
import { fontxl } from '@/styles/global';
import { rem } from '@/styles/global';
import { styled } from 'styled-components';
import { heightHeader } from '../../styles';

export const Container = styled.div`
  min-height: calc(100vh - ${heightHeader});
  height: 100%;
  min-width: ${rem(280)};
  background-color: ${colorwhite};
  box-shadow: 0 0 ${rem(8)} rgba(0, 0, 0, 0.2);
`;

export const Content = styled.div``;
export const Title = styled.div<{ $cursor?: boolean }>`
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
  text-indent: ${rem(6)};
  cursor: ${props => (props.$cursor ? 'pointer' : 'default')};
  svg {
    margin-left: ${rem(4)};
  }
`;

export const Text = styled.p`
  margin-top: ${rem(16)};
  width: 100%;
  text-align: center;
  font-size: ${fontmd};
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
