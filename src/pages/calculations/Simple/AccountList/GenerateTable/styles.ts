import DefaultModal from '@/components/DefaultModal';
import { ButtonActionDefault, fontlg, rem } from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
`;

export const Modal = styled(DefaultModal)``;

export const ModalContainer = styled.div`
  width: ${rem(400)};
  p {
    display: flex;
    font-size: ${fontlg};
    height: ${rem(80)};
    justify-content: center;
    align-items: center;
  }
`;

export const Button = styled(ButtonActionDefault)``;
