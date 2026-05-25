import DefaultModal from '@/components/DefaultModal';
import {
  typeAuthors,
  typeCorrection,
  typeExpense,
  typeExpenseSection,
  typeExpenseTitle,
  typeFee,
  typeFeeArt,
  typeFeeQC,
  typeFeeSM,
  typeFine,
  typeFineArt,
  typeFineCorrection,
  typeInterest,
  typeInterestCorrection,
  typeInterestCorrectionSuspend,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { ViewType } from '@/interfaces/calculations/ViewOccorrenceImp';
import { colorblack, colorgray80, colorred, rem } from '@/styles/global';
import styled, { css } from 'styled-components';

export const Modal = styled(DefaultModal)``;

export const TableContainer = styled.table`
  width: 90vw;
  height: 100%;
  overflow-y: auto;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: ${rem(16)};
`;

export const TableHeader = styled.th`
  text-align: start;
  font-weight: bold;
  color: ${colorblack};
  padding: 10px;
`;

export const Description = styled.p`
  color: #8b8787;
  font-size: ${rem(12)};
  font-style: italic;
  font-weight: normal;
`;

export const TableCell = styled.td<{ $isRight?: boolean; $type?: boolean; $red?: boolean }>`
  ${props => {
    return css`
      font-weight: ${props.$type ? 'bold' : 'normal'};
      color: ${props.$red ? colorred : colorblack};
      text-align: ${props.$isRight ? 'right' : 'left'};
    `;
  }}
  padding: 10px;
`;

export const TableLine = styled.tr<{ $type: ViewType }>`
  border-top: 1px solid #ddd;
  color: ${colorblack};
  font-weight: normal;
  &:first-child {
    border-top: 1px solid ${colorblack};
  }
  &:hover {
    background-color: ${colorgray80};
  }

  :first-child {
    text-indent: ${rem(24)};
  }

  ${props => {
    switch (props.$type) {
      case typeAuthors.id:
        return css`
          :first-child {
            text-indent: ${rem(0)};
            padding: ${rem(6)};
            font-weight: bold;
            margin-top: ${rem(16)};
          }
          background-color: ${colorgray80};
          border-bottom: 1px solid ${colorblack};
          border-top: 1px solid ${colorblack};
        `;
      case typeTotal.id:
        return css`
          :first-child {
            text-indent: ${rem(0)};
            padding: ${rem(6)};
            font-weight: bold;
          }
          border-top: 1px solid ${colorblack};
        `;
      case typeExpenseTitle.id:
        return css`
          :first-child {
            text-indent: ${rem(0)};
          }
          border-top: 1px solid ${colorblack};
          font-weight: bold;
        `;
      case typeExpense.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeExpenseSection.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeFee.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeFeeQC.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeFeeSM.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeFeeArt.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeFineArt.id:
        return css`
          :first-child {
            font-weight: bold;
          }
        `;
      case typeCorrection.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
      case typeFineCorrection.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
      case typeInterestCorrection.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
      case typeInterestCorrectionSuspend.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
      case typeInterest.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
      case typeFine.id:
        return css`
          :first-child {
            text-indent: ${rem(48)};
          }
        `;
    }
  }}
`;
