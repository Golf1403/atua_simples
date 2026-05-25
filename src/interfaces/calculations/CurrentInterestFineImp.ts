import { PercentageOrFixedType } from '@data/calculations/fineEntryTypes';
import { FrequencyType } from '@data/calculations/frequencyDaysTypes';
import { InterestTypesWithPeriodAndFine } from '@data/calculations/interestTypes';
import MonetaryFineImp from './MonetaryFineImp';
import MonetaryInterestImp from './MonetaryInterestImp';
import { typeFine, typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';

type MonetaryInterestType = Omit<MonetaryInterestImp, 'type' | 'periodicity' | 'percentage' | 'dateStart' | 'dateEnd'>;
type MonetaryFineType = Omit<MonetaryFineImp, 'type' | 'periodicity' | 'percentage' | 'dateStart' | 'dateEnd'>;

export interface CurrentInterestFineCommonImp {
  dateStart: string;
  dateEnd: string;
  tax: number | null;
  value: number;
  percentage?: number;
  periodicity: FrequencyType;
  selectType: PercentageOrFixedType;
  isCorrection?: boolean;
}

export interface CurrentInterestRestImp extends CurrentInterestFineCommonImp, MonetaryInterestType {
  type: typeInterest.id;
  description: InterestTypesWithPeriodAndFine;
}

export interface CurrenFineRestImp extends CurrentInterestFineCommonImp, MonetaryFineType {
  type: typeFine.id;
  description: string;
}

type CurrentInterestFineImp = CurrentInterestRestImp | CurrenFineRestImp;

export default CurrentInterestFineImp;
