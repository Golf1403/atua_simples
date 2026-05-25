import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { PercentageOrFixedType } from '@data/calculations/fineEntryTypes';

export interface PeriodImp {
  from: string;
  to: string;
  percentage: number;
  nomenclature: string;
  calculated: number | string;
}

export default interface MonetaryFineImp {
  id?: string | number;
  installmentId?: number;
  periodicity: string;
  dateStart: string;
  dateEnd: string;
  value: number;
  percentage: number;
  calculated: number;
  type: PercentageOrFixedType;
  onInstallmentsValue: boolean;
  onDefaultInterest: boolean;
  onCompoundInterest: boolean;
  onCompensatoryInterest: boolean;
  onInterestPeriod: boolean;
  calculatedInfo: FineResponseImp;
  index?: string;
  formula?: string;
  civilCodeDate?: string;
  civilCode?: CivilCodeInterest;
}

export interface FineResponseImp {
  result: number;
  periods: PeriodImp[];
  totalPercentage: number;
  value: number;
}
