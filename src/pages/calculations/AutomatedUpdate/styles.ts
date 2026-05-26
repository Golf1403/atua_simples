import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  padding: 18px 24px 28px;
`;

export const Header = styled.header`
  align-items: center;
  border-bottom: 1px solid #5a9acc;
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;

  h1 {
    background: #5797c8;
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
  gap: 8px;

  button {
    align-items: center;
    background: #5797c8;
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
      opacity: 0.7;
    }
  }
`;

export const Table = styled.table`
  background: #fff;
  border-collapse: collapse;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
  table-layout: fixed;
  width: 100%;

  th,
  td {
    border-bottom: 1px solid #d6e3ef;
    color: #60708d;
    font-size: 12px;
    height: 38px;
    overflow: hidden;
    padding: 0 12px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  th {
    color: #68779a;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
  }

  th:last-child,
  td:last-child {
    text-align: right;
    width: 120px;
  }
`;

export const Actions = styled.div`
  display: inline-flex;
  gap: 4px;
`;

export const ActionButton = styled.button`
  align-items: center;
  background: #fff;
  border: 1px solid #c7c7c7;
  border-radius: 3px;
  color: #63758c;
  display: inline-flex;
  height: 28px;
  justify-content: center;
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
