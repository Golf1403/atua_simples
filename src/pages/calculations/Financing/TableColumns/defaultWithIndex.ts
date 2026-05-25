import { DataTableColumnImp } from '../../../../interfaces/DataTableImp';

export const defaultTableColumnsWithIndex: DataTableColumnImp[] = [
  {
    columnIndex: 'parcel',
    columnName: '#',
  },
  {
    columnIndex: 'dueDate',
    columnName: 'Data Vcto',
    date: true,
  },
  {
    columnIndex: 'debt',
    columnName: 'Dívida',
    currency: true,
  },
  {
    columnIndex: 'rate',
    columnName: 'Taxa',
    percentage: true,
  },
  {
    columnIndex: 'indexValue',
    columnName: 'Índice',
    percentage: true,
  },
  {
    columnIndex: 'rateAndIndex',
    columnName: 'TX+Ind',
    percentage: true,
  },
  {
    columnIndex: 'correctedDebt',
    columnName: 'Dívida Corrigida',
    currency: true,
  },
  {
    columnIndex: 'interest',
    columnName: 'Juros',
    currency: true,
  },
  {
    columnIndex: 'correction',
    columnName: 'Correção',
    currency: true,
  },
  {
    columnIndex: 'amortization',
    columnName: 'Amortização',
    currency: true,
  },
  {
    columnIndex: 'installment',
    columnName: 'Prestação',
    currency: true,
  },
  {
    columnIndex: 'balance',
    columnName: 'Saldo',
    currency: true,
  },
];
