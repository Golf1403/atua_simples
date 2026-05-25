import { rem } from '@/styles/global';
import styled from 'styled-components';

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
