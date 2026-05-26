import {
  bold,
  coloraero,
  colorbabyponder,
  colorblue,
  colorblueE8,
  colorgray80,
  colorlightstategray,
  colorstategray,
  colorwhite,
  fontlg,
  fontmd,
  fontsm,
  rem,
} from '@/styles/global';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
  width: 100%;
  padding: ${rem(24)};
`;

export const ContentCard = styled.section`
  width: 100%;
  background: ${colorwhite};
  border: 1px solid ${colorgray80};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  padding: ${rem(16)};
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${rem(12)};
  align-items: end;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: ${rem(4)};
    width: 100%;
  }

  label {
    color: ${colorstategray};
    font-size: ${fontsm};
    line-height: 1;
  }

  input,
  select {
    width: 100%;
    min-height: ${rem(36)};
    padding: ${rem(8)} ${rem(10)};
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: ${rem(3)};
    background: ${colorbabyponder};
    color: ${colorlightstategray};
    font-size: ${fontmd};
  }

  input:focus,
  select:focus {
    border-color: ${colorblue};
    background: ${colorblueE8};
  }

  span {
    color: #f36062;
    font-size: ${fontsm};
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div<{ $span?: number }>`
  grid-column: span ${props => props.$span || 3};

  @media (max-width: 900px) {
    grid-column: span 3;
  }

  @media (max-width: 620px) {
    grid-column: 1 / -1;
  }
`;

export const CheckboxField = styled.label`
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: ${rem(8)};
  min-height: ${rem(36)};
  cursor: pointer;

  input {
    width: ${rem(14)};
    min-height: ${rem(14)};
    padding: 0;
  }

  @media (max-width: 900px) {
    grid-column: span 3;
  }

  @media (max-width: 620px) {
    grid-column: 1 / -1;
  }
`;

export const Actions = styled.div`
  grid-column: span 2;
  display: flex;
  align-items: end;

  button {
    width: 100%;
    min-height: ${rem(36)};
    border-radius: ${rem(18)};
    background: ${coloraero};
    color: ${colorwhite};
    font-size: ${fontmd};
    font-weight: ${bold};
    cursor: pointer;
    padding: 0 ${rem(16)};
  }

  @media (max-width: 900px) {
    grid-column: span 3;
  }

  @media (max-width: 620px) {
    grid-column: 1 / -1;
  }
`;

export const TableSection = styled(ContentCard)`
  overflow: auto;

  h2 {
    color: ${colorstategray};
    font-size: ${fontlg};
    margin-bottom: ${rem(8)};
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: ${fontmd};
  }

  th,
  td {
    border-bottom: 1px solid ${colorgray80};
    padding: ${rem(8)};
    text-align: right;
    white-space: nowrap;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  th {
    color: ${colorstategray};
    font-weight: ${bold};
  }
`;

export const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(${rem(130)}, 1fr));
  gap: ${rem(12)};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(${rem(130)}, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: ${colorwhite};
  border: 1px solid ${colorgray80};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: ${rem(12)};

  h2 {
    color: ${colorstategray};
    font-size: ${fontlg};
    margin-bottom: ${rem(6)};
  }

  p {
    color: ${colorblue};
    font-size: ${fontmd};
    font-weight: ${bold};
  }
`;
