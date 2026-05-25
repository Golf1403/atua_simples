import DefaultDateInput from '@/components/DefaultDateInput';
import DefaultModal from '@/components/DefaultModal';
import { fontmd, rem } from '@/styles/global';
import styled from 'styled-components';

export const Modal = styled(DefaultModal)``;

export const Container = styled.div`
  min-width: ${rem(400)};
  min-height: ${rem(300)};
`;
export const InterestContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  min-height: ${rem(500)};
  height: 100%;
  min-width: ${rem(750)};
  width: 100%;
  padding-bottom: ${rem(8)};
`;
export const FineContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  height: 100%;
  width: 100%;
  padding-bottom: ${rem(8)};
`;
export const Config = styled.div`
  width: ${rem(460)};
  padding-right: ${rem(16)};

  > div {
    padding-top: ${rem(4)};
  }
`;

export const Title = styled.h2`
  font-size: ${fontmd};
  text-indent: ${rem(8)};
  text-transform: uppercase;
`;

export const ApplyOn = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-box-flex: 1;
  -moz-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: #f2f2f2;
  margin: ${rem(8)} ${rem(8)} ${rem(8)} 0;
`;

export const InputDate = styled(DefaultDateInput)``;
