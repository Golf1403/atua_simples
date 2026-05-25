import { DataTableColumnImp } from '@interfaces/DataTableImp';

export const sumColumn = {
  columnIndex: 'sum',
  columnName: 'Soma',
  currency: true,
};

export const linearTableColumns: DataTableColumnImp[] = [
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
  sumColumn,
];
