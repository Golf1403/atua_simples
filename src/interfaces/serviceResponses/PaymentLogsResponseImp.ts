import { DataTableCellImp } from '@interfaces/DataTableImp';
import PaginateDataImp from '../PaginateDataImp';

export default interface PaymentLogsResponseImp extends PaginateDataImp {
  maxPages: number;
  totalRegisters: number;
  registerPerPage: number;
  list: DataTableCellImp[];
}
