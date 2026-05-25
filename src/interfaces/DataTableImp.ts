import { IconType } from 'react-icons';
import IDummyObject from './IDummyObject';

export interface DataTableColumnImp {
  columnIndex: string;
  columnName: string;
  columnSortable?: boolean;
  currency?: boolean;
  date?: boolean;
  percentage?: boolean;
}

export interface DataTableCellImp {
  [key: string]: string | number | JSX.Element | string[];
}

export default interface DataTableImp {
  financing?: boolean;
  numberOfSkeletons?: number;
  columns: DataTableColumnImp[];
  data: IDummyObject[];
  lines?: number;
  loading?: boolean;
  onOrder?: Function;
  className?: string;
  sortableIcon?: IconType;
}
