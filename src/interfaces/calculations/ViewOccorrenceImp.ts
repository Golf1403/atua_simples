import { InterestTypesWithPeriodAndFine } from '@data/calculations/interestTypes';
import {
  InterestFineTypes,
  OccurrenceTypes,
  OccurrenceWithoutFeeTypes,
  typeAuthors,
  typeCorrection,
  typeExpenseSection,
  typeExpenseTitle,
  typeFee,
  typeFeeArt,
  typeFeeQC,
  typeFeeSM,
  typeFineArt,
  typeFineCorrection,
  typeInterest,
  typeInterestCorrection,
  typeInterestCorrectionSuspend,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { CurrentOccorrenceBaseImp } from './CurrentOccurrenceImp';

export type ViewType =
  | InterestFineTypes
  | OccurrenceWithoutFeeTypes
  | typeFee.id
  | typeCorrection.id
  | typeTotal.id
  | typeAuthors.id
  | typeInterestCorrection.id
  | typeFineCorrection.id
  | typeInterestCorrectionSuspend.id
  | typeExpenseTitle.id
  | typeFineArt.id
  | typeFeeQC.id
  | typeFeeSM.id
  | typeFeeArt.id
  | typeExpenseSection.id;

export interface SummaryImp {
  date?: string;
  from?: OccurrenceTypes | typeAuthors | typeCorrection | typeInterest;
  desc: string;
  year?: number;
}

interface ViewOccorrenceImp extends Omit<CurrentOccorrenceBaseImp, 'priority' | 'date' | 'type'> {
  date: string | null;
  isCorrection?: boolean;
  dateEnd?: string | null;
  currency: string;
  currencyBalance?: string;
  balance: number;
  defaultTotal?: number;
  isWithoutCorrection?: boolean;
  compensatoryTotal?: number;
  compoundTotal?: number;
  interestBalance: number;
  fineBalance?: number;
  type: ViewType;
  extraDescription?: string;
  correctedFrom?: ViewType;
  details?: [string, string][];
  selectType?: InterestTypesWithPeriodAndFine;
  calculationsMemory?: string;
}

export default ViewOccorrenceImp;
