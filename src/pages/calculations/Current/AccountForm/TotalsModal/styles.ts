import {
  typeAuthors,
  typeCorrection,
  typeFee,
  typeinstallment,
  typeInterest,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { coloraero, colorblack, fontmd, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

export const TableBody = styled.tbody`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  min-width: ${rem(500)};
  min-height: ${rem(300)};
`;

export const Table = styled.table`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Row = styled.tr`
  display: flex;
  flex-direction: row;
  color: ${colorblack};
  font-size: ${fontmd};
  &:hover {
    color: ${coloraero};
  }
  &:last-child {
    font-weight: bold;
    margin-top: auto;
    padding-bottom: ${rem(16)};
  }
`;

export const Column = styled.td<{ $type?: string }>`
  ${props => {
    switch (props.$type) {
      case typeAuthors.id:
        return css`
          text-indent: ${rem(0)};
          font-weight: bold;
        `;

      case typeinstallment.id:
        return css`
          text-indent: ${rem(16)};
          font-weight: bold;
        `;
      case typeFee.id:
        return css`
          text-indent: ${rem(16)};
          font-weight: bold;
        `;

      case typeCorrection.id:
        return css`
          text-indent: ${rem(36)};
          width: ${rem(200)};
        `;
      case typeInterest.id:
        return css`
          text-indent: ${rem(36)};
          width: ${rem(200)};
        `;
      case typeTotal.id:
        return css`
          &:first-child {
            text-indent: ${rem(0)};
          }
          text-indent: ${rem(36)};
          width: ${rem(200)};
          font-weight: bold;
        `;
    }
  }};
  margin: 5px 10px;
`;
