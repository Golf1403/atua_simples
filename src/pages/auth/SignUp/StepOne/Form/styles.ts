import { fontmd, rem } from '@/styles/global';
import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

export const FormHeader = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${rem(10)};
  flex-direction: row;
`;

export const ColumnContainer = styled.div`
  display: flex;
  gap: ${rem(10)};
  flex-direction: column;
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 14px;
    color: #555;
  }

  input {
    padding: 10px;
    border: 1px solid #ccc;
    width: 20vw;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease-in-out;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;

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
