import styled from 'styled-components';
import { Form as FormikForm } from 'formik';
import { fontmd, rem } from '@/styles/global';

export const Form = styled(FormikForm)`
  margin-bottom: ${rem(60)};
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  padding: ${rem(20)};
  position: relative;

  h2 {
    font-size: ${rem(24)};
    margin-bottom: ${rem(20)};
  }

  label {
    font-size: ${fontmd};
    margin-top: ${rem(12)};
    margin-bottom: ${rem(4)};
  }

  input,
  select {
    padding: ${rem(12)};
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: ${fontmd};
  }
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

export const InputContainer = styled.div<{ inputLength?: number }>`
  width: ${props => (props.inputLength ? rem(props.inputLength) : rem(600))};
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
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease-in-out;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;

export const Description = styled.div<{ textIndent?: number }>`
  text-indent: ${props => rem(props.textIndent || 60)};
`;
