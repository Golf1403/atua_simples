import { styled } from 'styled-components';
import { rem, ButtonDefault, coloraero, colorwhite } from '@/styles/global';

export const Bold = styled.p`
  font-weight: bold;
  text-indent: ${rem(4)};
`;
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
  height: 100vh;
`;

export const LimitContainer = styled.div`
  width: 100%;
  max-width: ${rem(600)};
  text-align: center;
`;

export const Header = styled.div`
  padding-bottom: ${rem(8)};
`;
export const Footer = styled.div`
  padding-top: ${rem(8)};
`;
export const Content = styled.div`
  padding-top: ${rem(8)};
`;
export const Title = styled.h2`
  padding-top: ${rem(8)};
`;

export const Text = styled.p`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  width: 100%;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;

  &:first-child {
    padding-bottom: ${rem(16)};
  }
`;

export const ButtonContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${coloraero};
  height: ${rem(40)};

  &:hover {
    background-color: rgba(61, 171, 255, 0.57);
  }

  button {
    color: ${colorwhite};
  }
`;
export const Button = styled(ButtonDefault)``;
