import {
  OccurrenceTypes,
  typeExpense,
  typeExpenseSection,
  typeFee,
  typePayment,
  typeinstallment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import MonetaryInterestImp from './MonetaryInterestImp';

export interface CurrentOccorrenceBaseImp {
  date: string;
  updateSince: string | null;
  tax: number | null;
  value: number;
  total: number;
  description: string;
  descriptionCalc?: string;
  type: OccurrenceTypes;
  priority: number;
  newestOccurrence?: boolean;
}

export interface CurrentInstallmentOccorrenceImp extends CurrentOccorrenceBaseImp {
  isWithoutCorrection: boolean;
  type: typeinstallment.id;
}

export interface CurrentExpenseImp extends CurrentOccorrenceBaseImp {
  type: typeExpenseSection.id | typeExpense.id;
}

export interface CurrentPaymentImp extends CurrentOccorrenceBaseImp {
  isBeforeCorrection: boolean;
  type: typePayment.id;
}

export type FeeTypes = 'attorneys' | 'attorneys-installment' | 'expert' | 'assistant' | 'succumbence' | 'newCpc';

export interface QuantiaCertaImp {
  total?: number;
  interest: MonetaryInterestImp;
  indexId: number;
  from: string;
  updateTo: string;
  value: number;
}

export interface SalarioMinimoImp {
  tax0: number;
  tax1: number;
  tax2: number;
  tax3: number;
  tax4: number;
  valueBase0: number;
  valueBase1: number;
  valueBase2: number;
  valueBase3: number;
  valueBase4: number;
  valueSM: number;
  isCalc: boolean;
  indexId: number;
  feePercentageRanges: any[];
  total: number;
  date: string;
}
export interface CurrentFeeOccorrenceImp extends Omit<CurrentOccorrenceBaseImp, 'type' | 'date'> {
  type: typeFee.id;
  calculated: number;
  order: number;
  date: string | null;
  newCpc: boolean;
  selectType: 'attorneys-installment' | 'attorneys' | 'expert' | 'assistant' | 'succumbence' | 'newCpc';
  isOpenFeeConfig?: boolean;
  isCalcByInstallment?: boolean;
  isFeeCpc?: boolean;
  salariominimo?: SalarioMinimoImp;
  quantiacerta?: QuantiaCertaImp;
}

type CurrentOccurrenceImp =
  | CurrentPaymentImp
  | CurrentExpenseImp
  | CurrentInstallmentOccorrenceImp
  | CurrentFeeOccorrenceImp;

export default CurrentOccurrenceImp;
