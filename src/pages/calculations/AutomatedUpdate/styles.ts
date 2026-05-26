import styled from 'styled-components';

const blue = '#5797c8';
const label = '#68779a';
const border = '#cfdceb';
const icon = '#63758c';

export const Container = styled.section`
  width: 100%;
  padding: 18px 24px 28px;
`;

export const Header = styled.header`
  align-items: center;
  border-bottom: 1px solid ${blue};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 18px;

  h1 {
    background: ${blue};
    border-radius: 0 20px 20px 0;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    line-height: 36px;
    margin: 0;
    min-width: 320px;
    padding: 0 22px;
    text-transform: uppercase;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;

  button {
    align-items: center;
    background: ${blue};
    border: 0;
    border-radius: 18px;
    color: #fff;
    display: inline-flex;
    font-size: 13px;
    font-weight: 700;
    gap: 8px;
    height: 34px;
    padding: 0 16px;

    &:disabled {
      cursor: wait;
      opacity: 0.65;
    }
  }
`;

export const Panel = styled.div`
  background: #fff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.16);
  margin-bottom: 18px;
  padding: 28px 24px 20px;
  position: relative;
`;

export const PanelTitle = styled.h2`
  background: ${blue};
  border-radius: 0 20px 20px 0;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  left: 0;
  line-height: 32px;
  margin: 0;
  min-width: 320px;
  padding: 0 20px;
  position: absolute;
  text-transform: uppercase;
  top: -16px;
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 14px 10px;
  grid-template-columns: minmax(190px, 1fr) minmax(260px, 2fr) minmax(160px, 1fr) minmax(160px, 1fr);

  .wide {
    grid-column: span 2;
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .wide {
      grid-column: span 1;
    }
  }
`;

export const Field = styled.label`
  color: ${label};
  display: flex;
  flex-direction: column;
  font-size: 11px;
  gap: 4px;
  text-transform: uppercase;

  input,
  select {
    border: 1px solid #c7c7c7;
    border-radius: 3px;
    color: #000;
    font-size: 13px;
    height: 34px;
    min-width: 0;
    padding: 0 10px;
    text-transform: none;
    width: 100%;
  }

  .checks {
    align-items: center;
    border: 1px solid #c7c7c7;
    border-radius: 3px;
    display: flex;
    gap: 14px;
    height: 34px;
    padding: 0 10px;
  }
`;

export const CheckboxLabel = styled.label`
  align-items: center;
  color: ${label};
  display: inline-flex;
  font-size: 12px;
  gap: 6px;
  text-transform: uppercase;

  input {
    height: 14px;
    margin: 0;
    width: 14px;
  }
`;

export const Section = styled.section`
  margin-bottom: 22px;
`;

export const SectionHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${border};
  display: flex;
  gap: 14px;
  justify-content: space-between;
  min-height: 38px;

  &.sub {
    border-bottom: 0;
    justify-content: flex-start;
    margin: 4px 0 8px;
  }

  div {
    display: flex;
    gap: 8px;
  }

  button {
    align-items: center;
    background: ${blue};
    border: 0;
    border-radius: 18px;
    color: #fff;
    display: inline-flex;
    font-size: 13px;
    font-weight: 700;
    gap: 8px;
    height: 36px;
    min-width: 220px;
    padding: 0 18px;
  }

  strong {
    color: #2f80c0;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }
`;

export const RowGrid = styled.div`
  align-items: center;
  border-left: 6px solid ${blue};
  display: grid;
  gap: 8px;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  margin-bottom: 10px;
  padding-left: 10px;

  input {
    border: 1px solid #c7c7c7;
    border-radius: 3px;
    font-size: 13px;
    height: 34px;
    padding: 0 10px;
    width: 100%;
  }
`;

export const Table = styled.table`
  background: #fff;
  border-collapse: collapse;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.14);
  table-layout: fixed;
  width: 100%;

  th,
  td {
    border-bottom: 1px solid #d6e3ef;
    color: #60708d;
    font-size: 12px;
    height: 38px;
    overflow: hidden;
    padding: 4px 8px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    color: ${label};
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
  }

  input,
  select {
    border: 1px solid #c7c7c7;
    border-radius: 3px;
    font-size: 12px;
    height: 28px;
    min-width: 0;
    padding: 0 8px;
    width: 100%;
  }

  input[type='checkbox'] {
    height: 14px;
    width: 14px;
  }

  th:last-child,
  td:last-child {
    text-align: right;
    width: 130px;
  }
`;

export const Actions = styled.div`
  display: inline-flex;
  gap: 4px;
  justify-content: flex-end;
`;

export const InlineActions = styled.div`
  display: inline-flex;
  gap: 4px;
`;

export const ActionButton = styled.button`
  align-items: center;
  background: #fff;
  border: 1px solid #c7c7c7;
  border-radius: 3px;
  color: ${icon};
  display: inline-flex;
  height: 28px;
  justify-content: center;
  padding: 0;
  width: 28px;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const EmptyState = styled.div`
  color: #60708d;
  font-size: 13px;
  padding: 18px 12px;
`;

export const TotalBar = styled.div`
  align-items: center;
  border-bottom: 1px solid ${blue};
  display: flex;
  justify-content: space-between;
  margin: 28px 0 26px;

  span {
    background: ${blue};
    border-radius: 0 20px 20px 0;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    line-height: 42px;
    min-width: 420px;
    padding: 0 22px;
    text-transform: uppercase;
  }

  strong {
    color: #2f80c0;
    font-size: 18px;
    padding-right: 10px;
  }
`;
