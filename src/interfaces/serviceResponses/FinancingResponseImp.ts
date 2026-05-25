import PaginateDataImp from '../PaginateDataImp';
import { DataTableCellImp } from '@interfaces/DataTableImp';

export default interface FinancingResponseImp extends PaginateDataImp {
  installments: DataTableCellImp[];
  total: {
    amortization: number;
    correction: number;
    installment: number;
    interest: number;
    sum: number;
  };
}
