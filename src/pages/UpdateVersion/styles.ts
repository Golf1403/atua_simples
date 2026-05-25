import {
  paddingChildren as paddingChildrenTop,
  paddingChildren as paddingChildrenBottom,
  paddingSection as paddingSectionTop,
  paddingSection as paddingSectionBottom,
  heightHeader,
  borderBottomHeader,
} from '@/components/PanelLayout/styles';
import { coloraero, fontmd, rem } from '@/styles/global';
import { styled } from 'styled-components';

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
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  height: calc(
    100vh - ${heightHeader} - ${paddingSectionTop} - ${paddingSectionBottom} - ${paddingChildrenBottom} -
      ${paddingChildrenTop} - ${borderBottomHeader}
  );
`;
export const Title = styled.h1`
  font-size: ${rem(60)};
  color: ${coloraero};
`;
export const Text = styled.p`
  color: ${coloraero};
  font-size: ${fontmd};
`;
