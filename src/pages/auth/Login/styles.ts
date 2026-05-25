import { colorbabyponder, coloraero, colorwhite, rem } from '@/styles/global';
import styled, { keyframes } from 'styled-components';
import { Form as FormFormk } from 'formik';
import DefaultInput from '@/components/DefaultInput';

export const Input = styled(DefaultInput)``;
export const InputContainer = styled.div`
  margin: 0;
  width: 100%;
  label,
  input {
    margin: 0;
  }
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
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
`;

export const Content = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  background-color: ${colorbabyponder};
  width: ${rem(400)};
  height: ${rem(450)};
  border-radius: ${rem(5)};
  padding: ${rem(60)};
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
`;

const AppearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
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
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  animation: ${AppearFromLeft} 1s;
  width: 100%;
  height: 100%;
`;

export const Image = styled.img`
  width: 100%;
  margin-bottom: ${rem(30)};
  img {
    width: 100%;
  }
`;

export const Footer = styled.footer`
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
  text-align: center;
  margin-top: ${rem(16)};
`;

export const Button = styled.button`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  align-items: center;
  background-color: ${coloraero};
  width: 100%;
  height: ${rem(40)};
  cursor: pointer;
  color: ${colorwhite};

  &:hover {
    background-color: rgba(61, 171, 255, 0.57);
  }
`;

export const Form = styled(FormFormk)`
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
  width: 100%;
  height: 100%;
  div + div {
    padding-bottom: ${rem(8)};
  }
`;
