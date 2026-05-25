import { rem } from '@/styles/global';
import styled from 'styled-components';

export const Text = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${rem(60)};
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
export const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${rem(10)};
  flex-direction: row;
`;
