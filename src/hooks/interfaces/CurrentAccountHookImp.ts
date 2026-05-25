import { CurrentTypes } from '@/data/calculations/currentTypes';
import { typeAttorneys } from '@/data/calculations/feeTypes';
import { frequencyDayMonthly } from '@/data/calculations/frequencyDaysTypes';
import { typeDefault } from '@/data/calculations/interestTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import AccountImp from '@/interfaces/AccountImp';
import { FormRadioImp } from '@/interfaces/FormGroupRadioImp';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import SelectOptionImp from '@/interfaces/SelectOptionImp';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import {
  CurrentExpenseImp,
  CurrentFeeOccorrenceImp,
  CurrentInstallmentOccorrenceImp,
  CurrentPaymentImp,
} from '@/interfaces/calculations/CurrentOccurrenceImp';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import { IndexResponseImp } from '@/interfaces/serviceResponses/IndexResponseImp';
import moment from 'moment';
import { savingsType } from '@/enums/SavingsType';
import MonetaryInterestImp from '@/interfaces/calculations/MonetaryInterestImp';
import { CurrenFineRestImp, CurrentInterestRestImp } from '@/interfaces/calculations/CurrentInterestFineImp';
import { finePercentageType } from '@/data/calculations/fineEntryTypes';
import MonetaryFineImp from '@/interfaces/calculations/MonetaryFineImp';
import { FeeFinesImp } from '../currentAccount';
import CivilCodeInterest from '@/enums/CivilCodeInterest';

const initialInterestBase: MonetaryInterestImp = {
  id: '',
  type: typeDefault.id,
  dateStart: moment(new Date()).add(-1, 'month').format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  percentage: 1,
  index: '',
  formula: 'S',
  periodicity: 'month',
  capitalization: 'monthly',
  onInstallmentsValue: true,
  onDefaultInterest: false,
  onCompensatoryInterest: false,
  onCompoundInterest: false,
  onInterestPeriod: false,
  onInterestWithoutCorrection: false,
  onTransitiveInterest: false,
  calculated: 0.0,
  civilCodeDate: moment('10/01/2003', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureFirstDate: moment('31/12/2002', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureSecondDate: moment('30/06/2009', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureThirdDate: moment('01/07/2009', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  poupancaType: savingsType.id,
  civilCode: CivilCodeInterest.NOT_APPLY,
  calculatedInfo: {
    periods: [],
    result: 0,
    value: 0,
    totalPercentage: 0,
    withoutTaxCorrection: false,
  },
};

const initialFineBase: MonetaryFineImp = {
  percentage: 1,
  periodicity: 'month',
  dateStart: moment(new Date()).subtract(1, 'y').format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  type: finePercentageType.id,
  value: 1.0,
  onInstallmentsValue: true,
  onDefaultInterest: false,
  onCompensatoryInterest: false,
  onCompoundInterest: false,
  onInterestPeriod: false,
  calculated: 0.0,
  calculatedInfo: {
    periods: [],
    result: 0,
    totalPercentage: 0,
    value: 0,
  },
};
export interface InfoCurrentAccountImp {
  visible: boolean;
  loading: boolean;
  message: string;
  type: CurrentTypes;
  positive: {
    list: FormRadioImp[];
    current: boolean;
  };
  index: {
    current: null | IndexResponseImp;
    list: SelectOptionImp[];
  };
}

export interface AccountFormImp {
  toolbar: {
    loading: {
      save: boolean;
      reload: boolean;
    };
  };
}
export interface AuthorRowImp {
  authorIndex: number;
  currency: string;
}

export enum typePayment {
  id = 'payment',
  label = 'Pagamentos',
}
export enum typeinstallment {
  id = 'installment',
  label = 'Parcelas',
}
export enum typeInterest {
  id = 'interest',
  label = 'Juros',
}
export enum typeFine {
  id = 'fine',
  label = 'Multa',
}
export enum typeFineArt {
  id = 'fine_art',
  label = 'Multa',
}
export enum typeAuthors {
  id = 'authors',
  label = 'Autores',
}
export enum typeInfos {
  id = 'infos',
  label = 'Informações',
}
export enum typeConfiguration {
  id = 'configuration',
  label = 'Configurações',
}
export enum typeFee {
  id = 'fee',
  label = 'Honorários',
}
export enum typeFeeSM {
  id = 'fee-sm',
  label = 'Honorário em salário mínimo',
}
export enum typeFeeQC {
  id = 'fee-qc',
  label = 'Honorário por quantia certa',
}

export enum typeFeeArt {
  id = 'fee_art',
  label = 'Honorários',
}

export enum typeExpense {
  id = 'expense',
  label = 'Diversos',
}
export enum typeExpenseSection {
  id = 'expense-section',
  label = 'Despesas',
}
export enum typeInterestCorrection {
  id = 'monetary-interest',
  label = 'Correção Monetária dos Juros',
}

export enum typeFineCorrection {
  id = 'monetary-fine',
  label = 'Correção Monetária da Multa',
}

export enum typeInterestCorrectionSuspend {
  id = 'no-monetary-interest',
  label = 'Suspensão da Correção Monetária',
}
export enum typeCorrection {
  id = 'monetary-correction',
  label = 'Correção Monetária',
}
export enum typeTotal {
  id = 'total',
  label = 'Total',
}
export enum typeExpenseTitle {
  id = 'expense-title',
  label = 'Despesas',
}

export interface SelectOccurrenceImp {
  id: OccurrenceTypes;
  value: OccurrenceTypes;
  label: OccurrenceLabelTypes;
  click: Function;
}

export interface SelectFineImp {
  id: typeFine.id;
  value: typeFine.id;
  label: typeFine.label;
  click: Function;
}

export interface SelectInterestImp {
  id: typeInterest.id;
  value: typeInterest.id;
  label: typeInterest.label;
  click: Function;
}

export interface SelectFeeOccurrenceImp {
  id: typeFee.id;
  value: typeFee.id;
  label: typeFee.label;
  click: Function;
}
export interface SelectFeeOccurrenceImp {
  id: typeFee.id;
  value: typeFee.id;
  label: typeFee.label;
  click: Function;
}

export const typePaymentSelect: SelectOccurrenceImp = {
  id: typePayment.id,
  value: typePayment.id,
  label: typePayment.label,
  click: () => null,
};
export const typeinstallmentSelect: SelectOccurrenceImp = {
  id: typeinstallment.id,
  value: typeinstallment.id,
  label: typeinstallment.label,
  click: () => null,
};
export const typeInterestSelect: SelectInterestImp = {
  id: typeInterest.id,
  value: typeInterest.id,
  label: typeInterest.label,
  click: () => null,
};
export const typeFineSelect: SelectFineImp = {
  id: typeFine.id,
  value: typeFine.id,
  label: typeFine.label,
  click: () => null,
};
export const typeFeeSelect: SelectFeeOccurrenceImp = {
  id: typeFee.id,
  value: typeFee.id,
  label: typeFee.label,
  click: () => null,
};
export const typeExpenseSelect: SelectOccurrenceImp = {
  id: typeExpense.id,
  value: typeExpense.id,
  label: typeExpense.label,
  click: () => null,
};

type SelectOccurrenceTypes = SelectOccurrenceImp | SelectFeeOccurrenceImp;
type SelectFineAndInterestTypes = SelectFineImp | SelectInterestImp;

export const selectOccurrenceTypes: SelectOccurrenceTypes[] = [
  typeinstallmentSelect,
  typePaymentSelect,
  typeExpenseSelect,
  typeFeeSelect,
];

const occurrenceDefault = {
  priority: 3,
  date: moment(new Date()).format(dateFormatEnum.DEFAULT),
  description: '',
  tax: null,
  value: 0,
  updateSince: null,
  total: 0,
};

export const initialExpenseOccurrence: CurrentExpenseImp = {
  ...occurrenceDefault,
  tax: null,
  priority: 2,
  type: typeExpense.id,
};

export const pagination: PaginateResponseImp = {
  current: 1,
  pages: 1,
  order: 'asc',
  orderBy: 'costCenterId',
  total: 1,
};

export const initialInstallmentOccurrence: CurrentInstallmentOccorrenceImp = {
  ...occurrenceDefault,
  isWithoutCorrection: false,
  priority: 0,
  date: moment(new Date()).format(dateFormatEnum.DEFAULT),
  type: typeinstallment.id,
};
export const initialPaymentOccurrence: CurrentPaymentImp = {
  ...occurrenceDefault,
  priority: 0,
  isBeforeCorrection: false,
  date: moment(new Date()).format(dateFormatEnum.DEFAULT),
  type: typePayment.id,
};

export const initialFine: CurrenFineRestImp = {
  ...initialFineBase,
  dateStart: moment(new Date()).format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  description: '',
  tax: null,
  isCorrection: false,
  type: typeFine.id,
  value: 0,
  selectType: 'percentage',
  periodicity: frequencyDayMonthly.value,
};

export const initialInterest: CurrentInterestRestImp = {
  ...initialInterestBase,
  type: typeInterest.id,
  dateStart: moment(new Date()).format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  tax: 0,
  description: typeDefault.id,
  selectType: 'percentage',
  periodicity: frequencyDayMonthly.value,
  isCorrection: true,
  value: 0,
};

export const initialFeeOccurrence: CurrentFeeOccorrenceImp = {
  ...occurrenceDefault,
  type: typeFee.id,
  tax: 0,
  calculated: 0,
  priority: 1,
  newCpc: false,
  order: 0,
  selectType: typeAttorneys.id,
  quantiacerta: {
    interest: initialInterestBase,
    total: 0,
    from: '01/01/2000',
    updateTo: '01/01/2000',
    indexId: 66,
    value: 0,
  },
  isCalcByInstallment: true,
  isFeeCpc: false,
  isOpenFeeConfig: false,
  salariominimo: {
    tax0: 0,
    tax1: 0,
    tax2: 0,
    tax3: 0,
    tax4: 0,
    valueBase0: 0,
    valueBase1: 0,
    valueBase2: 0,
    valueBase3: 0,
    valueBase4: 0,
    valueSM: 0,
    indexId: 66,
    isCalc: false,
    feePercentageRanges: [],
    total: 0,
    date: '01/01/2000',
  },
};

export const selectInterestFine: SelectFineAndInterestTypes[] = [typeInterestSelect, typeFineSelect];

export type InterestFineTypes = typeFine.id | typeInterest.id;
export type FeeFineTypes = typeFineArt.id | typeFeeArt.id;

export type OccurrenceWithoutFeeTypes = typeExpense.id | typeinstallment.id | typeExpense.id | typePayment.id;
export type OccurrenceTypes =
  | typeExpense.id
  | typeinstallment.id
  | typeExpense.id
  | typeFee.id
  | typePayment.id
  | typeExpenseSection.id;
export type OccurrenceLabelTypes = typeExpense.label | typeinstallment.label | typePayment.label;

export interface LayoutImp {
  selectOccurrence: {
    buttons: SelectOccurrenceTypes[];
    visible: boolean;
    authorIndex: number;
    newestOccurrence: boolean;
  };
  selectInterestFine: {
    buttons: SelectFineAndInterestTypes[];
    visible: boolean;
    authorIndex: number;
  };
  viewModal: {
    visible: boolean;
    views: ViewOccorrenceImp[];
  };
  accountForm: AccountFormImp;
  authorRow: AuthorRowImp;
  footerButton: {
    isCalculated: boolean;
    isLoading: boolean;
  };
  modalAddAuthor: {
    visible: boolean;
  };
  modalEditAuthor: {
    visible: boolean;
  };
}

export interface CurrentAccountImp {
  list: AccountImp[];
  pagination: PaginateResponseImp;
  current: AccountImp;
  infos: InfoCurrentAccountImp;
}

export interface InfoCurrentAuthorImp {
  visible: boolean;
  loading: boolean;
  message: string;
}

export interface CurrentAuthorTypes {
  list: CurrentAuthorImp[];
  pagination: PaginateResponseImp;
}
export interface CurrentState {
  readonly account: CurrentAccountImp;
  readonly author: CurrentAuthorTypes;
  readonly layout: LayoutImp;
  readonly feeFines: FeeFinesImp;
}
