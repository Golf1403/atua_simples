import { coloraero, colorbabyponder, colorblack, colorblueE8, fontlg, fontmd, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 100vw;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-evenly;
  width: 50vw;
`;

export const FrequencyHeader = styled.div`
  display: flex;
`;

export const FrequencyRadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const FrequencyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Label = styled.label<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ $isActive }) => ($isActive ? '#007bff' : '#fff')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#333')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#007bff' : '#ccc')};

  input {
    display: none;
  }

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#0056b3' : '#f1f1f1')};
  }
`;

export const PlanContainer = styled.div`
  display: flex;
  place-items: center;
  max-width: 100vw;
  overflow-y: visible;
  gap: 16px;
`;

export const CalcDesc = styled.div`
  font-size: 0.8rem;
`;

export const TotalDesc = styled.p`
  font-size: 1rem;
`;

export const PlanCard = styled.div<{ $isHovered?: boolean; $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  place-items: center;
  align-items: center;
  padding: 24px;
  gap: 12px;
  border: 2px solid ${({ $isHovered, $isSelected }) => ($isSelected ? '#007bff' : $isHovered ? '#80b3ff' : '#ccc')};
  border-radius: 8px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#f1f9ff' : '#fff')};
  box-shadow: ${({ $isHovered, $isSelected }) =>
    $isHovered || $isSelected ? '0 4px 8px rgba(0, 123, 255, 0.3)' : 'none'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f1f9ff;
    border-color: #007bff;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0;
    color: ${({ $isSelected }) => ($isSelected ? '#007bff' : '#333')};
  }

  p {
    color: ${({ $isSelected }) => ($isSelected ? '#007bff' : '#666')};
    margin: 0;
  }
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-width: 100vw;
`;

export const FeatureColumn = styled.div`
  border-bottom: 1px solid #ccc;

  max-width: ${rem(150)};
  padding-right: ${rem(16)};
  width: 100%;

  &:first-child {
    color: black;
    min-width: ${rem(300)};
  }

  line-height: ${rem(16)};

  word-break: break-all;
  box-sizing: border-box;
  word-wrap: break-word;

  .limited-resource {
    font-size: ${fontlg};
    color: ${coloraero};
    font-weight: bold;
  }

  .unlimited-resource {
    font-size: ${fontlg};
    color: ${coloraero};
    font-weight: bold;
  }
`;

export const FeatureRow = styled.div`
  &:first-child {
    color: black;
  }
  flex-wrap: wrap;
  display: flex;
  padding: 8px 16px;
  width: 100%;
`;

export const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  :hover {
    opacity: 85%;
  }
  button {
    padding: 8px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  div {
    min-width: 32px;
    text-align: center;
    font-size: 1rem;
  }
`;
