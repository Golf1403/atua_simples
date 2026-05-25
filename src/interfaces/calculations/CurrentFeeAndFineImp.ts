import { PercentageOrFixedType } from '@data/calculations/fineEntryTypes';
import { FrequencyType } from '@data/calculations/frequencyDaysTypes';
import { InterestTypes } from '@data/calculations/interestTypes';

export interface CurrentInterestFineCommonImp {
  dateStart: string;
  dateEnd?: string;
  tax: number | null;
  percentage?: number;
  value: number;
  description: InterestTypes | string;
  periodicity: FrequencyType;
  isCorrection?: boolean;
}

export interface CurrentInterestRestImp extends CurrentInterestFineCommonImp {
  type: 'fee';
}

export interface CurrenFineRestImp extends CurrentInterestFineCommonImp {
  selectType?: PercentageOrFixedType;
  type: 'fine';
}

type CurrentFeeAndFineImp = CurrenFineRestImp | CurrentInterestRestImp;

export default CurrentFeeAndFineImp;
