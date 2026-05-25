import { DataTableCellImp } from '@interfaces/DataTableImp';
import PaginateDataImp from '../PaginateDataImp';
import PaginateResponseImp from '../PaginateResponseImp';

export default interface CalculationsResponseImp extends PaginateDataImp {
  total?: number;
  totalRegisters?: number;
  registerPerPage?: number;
  list?: DataTableCellImp[];
  pagination: PaginateResponseImp;
  results: DataTableCellImp[];
}
