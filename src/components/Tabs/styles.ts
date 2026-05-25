import { colorlightblue, rem } from '@/styles/global';
import { styled } from 'styled-components';
import DefaultTitle from '../Title';

export const Title = styled(DefaultTitle)``;

export const TabsContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  position: absolute;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  justify-content: space-around;
  top: ${rem(-20)};
  left: 0;
  right: 0;
  height: ${rem(40)};
  span {
    font-weight: normal;
  }
`;

export const Tab = styled.div<{ $active: boolean }>`
  cursor: ${props => (props.$active ? 'pointer' : 'default')};
  width: ${rem(200)};
  border: ${props => (props.$active ? `${rem(2)} solid ${colorlightblue}` : 'none')};
  height: ${rem(50)};
  padding: ${rem(4)};
  border-radius: ${rem(50)};
`;

export const Content = styled.div`
  padding: ${rem(20)};
  width: 100%;
`;
