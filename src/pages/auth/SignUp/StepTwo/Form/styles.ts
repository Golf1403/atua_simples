import styled from 'styled-components';
import { Form as FormikForm } from 'formik';
import { fontmd, rem } from '@/styles/global';

export const Form = styled(FormikForm)`
  margin-bottom: ${rem(60)};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  padding: ${rem(10)};
  position: relative;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 20vw;
`;

export const FooterContainer = styled.div`
  display: flex;
  justify-content: end;
  position: absolute;
  right: 0;
  bottom: ${rem(8)};
`;

export const BackContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;

  button {
    flex: 1;
    border-radius: 4px;
    border: none;
    font-size: ${fontmd};
    cursor: pointer;
    padding: ${rem(16)};
    transition: all 0.3s ease-in-out;

    background-color: #ddd;

    &:hover {
      background-color: #ccc;
    }
  }
`;

export const NextContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;

  button {
    flex: 1;
    border-radius: 4px;
    border: none;
    font-size: ${fontmd};
    cursor: pointer;
    padding: ${rem(16)};
    transition: all 0.3s ease-in-out;
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }
`;
