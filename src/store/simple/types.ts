import MemCalcImp from '@interfaces/MemCalcImp';
import SimpleAuthorImp from '@interfaces/calculations/SimpleAuthorImp';
import ExpenseImp from '@interfaces/calculations/ExpenseImp';
import FeeImp from '@interfaces/calculations/FeeImp';
import MonetaryFine523Imp from '@interfaces/calculations/MonetaryFine523Imp';
import PaymentImp from '@interfaces/calculations/PaymentImp';
import SimpleInstallmentImp from '@interfaces/calculations/SimpleInstallmentImp';
import AccountImp from '@interfaces/AccountImp';
import { DataTableCellImp } from '@interfaces/DataTableImp';
import PaginateResponseImp from '@interfaces/PaginateResponseImp';
import { AdministrativeNatureCorrectionImp } from '@interfaces/calculations/MonetaryCorrectionParamsImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import { Dispatch } from 'redux';
import { SimpleAccountImp } from '@interfaces/SimpleAccountImp';
import { FactorImp } from '@/interfaces/FactorImp';
import { typeExpense, typeFee, typePayment, typeinstallment } from '@/hooks/interfaces/CurrentAccountHookImp';
import { DetailedImp } from '@/interfaces/DetailedImp';

export interface ActionsImp {
  account: {
    save: boolean;
    active: SimpleAccountImp | null;
  };
  print: {
    modal: {
      visible: boolean;
    };
    submit: (dispatch: Dispatch) => void;
  };
  author: {
    index: number | null;
    lastIndex: number;
    modal: {
      add: boolean;
      edit: boolean;
    };
    active: SimpleAuthorImp | null;
  };
  add: {
    installment: {
      authorIndex: number | null;
      modal: {
        visible: boolean;
      };
      submit: (installmentData: SimpleInstallmentImp, account: AccountImp, dispatch: Dispatch) => void;
    };
    payment: {
      authorIndex: number | null;
      modal: {
        visible: boolean;
      };
      submit: (paymentData: PaymentImp, dispatch: Dispatch) => void;
    };
    fee: {
      modal: {
        visible: boolean;
      };
      submit: (feeData: FeeImp, dispatch: Dispatch) => void;
    };
    expense: {
      modal: {
        visible: boolean;
      };
      submit: (expenseData: ExpenseImp, dispatch: Dispatch) => void;
    };
  };
  edit: {
    installment: {
      authorIndex: number | null;
      active: SimpleInstallmentImp | null;
      modal: {
        visible: boolean;
      };
      key: number;
    };
    payment: {
      authorIndex: number | null;
      active: PaymentImp | null;
      modal: {
        visible: boolean;
      };
      key: number;
    };
    fee: {
      active: FeeImp | null;
      modal: {
        visible: boolean;
      };
      key: number;
      submit: (feeData: FeeImp, dispatch: Dispatch) => void;
    };
    expense: {
      active: ExpenseImp | null;
      modal: {
        visible: boolean;
      };
      key: number;
      submit: (expenseData: ExpenseImp, dispatch: Dispatch) => void;
    };
  };
}

export enum SimpleActionTypes {
  SET_ACTIONS = '@@simple/SET_ACTIONS',
  SET_INDEX_ID = '@@simple/SET_INDEX_ID',
  SET_ACCOUNT = '@@simple/SET_ACCOUNT',
  SET_LOADED_MEM_CALC_HAS_FACTORS = '@@simple/SET_LOADED_MEM_CALC_HAS_FACTORS',
  SET_ACCOUNT_PAGINATION = '@@simple/SET_ACCOUNT_PAGINATION',
  SET_WAS_SAVED_ACCOUNT = '@@simple/SET_WAS_SAVED_ACCOUNT',
  SET_NATURE_ADMINISTRATIVE_HAS_FACTORS = '@@simple/SET_NATURE_ADMINISTRATIVE_HAS_FACTORS',
  SET_ACCOUNTS = '@@simple/SET_ACCOUNTS',
  SET_AUTHORS = '@@simple/SET_AUTHORS',
  SET_IS_AUTHORS_LOADING = '@@simple/SET_IS_AUTHORS_LOADING',
  SET_FEES = '@@simple/SET_FEES',
  SET_EXPENSES = '@@simple/SET_EXPENSES',
  SET_ACCOUNT_TOTAL = '@@simple/SET_TOTAL',
  SET_EXPENSES_TOTAL = '@@simple/SET_EXPENSES_TOTAL',
  SET_POSITIVE = '@@simple/SET_POSITIVE',
  SET_FEES_TOTAL = '@@simple/SET_FEES_TOTAL',
  SET_INSTALLMENTS_TOTAL = '@@simple/SET_INSTALLMENTS_TOTAL',
  SHOW_AUTHOR_MODAL = '@@simple/SHOW_AUTHOR_MODAL',
  HIDE_AUTHOR_MODAL = '@@simple/HIDE_AUTHOR_MODAL',
  SHOW_EDIT_AUTHOR_MODAL = '@@simple/SHOW_EDIT_AUTHOR_MODAL',
  SHOW_ADD_INSTALLMENT_MODAL = '@@simple/SHOW_ADD_INSTALLMENT_MODAL',
  HIDE_ADD_INSTALLMENT_MODAL = '@@simple/HIDE_ADD_INSTALLMENT_MODAL',
  SHOW_EDIT_INSTALLMENT_MODAL = '@@simple/SHOW_EDIT_INSTALLMENT_MODAL',
  HIDE_EDIT_INSTALLMENT_MODAL = '@@simple/HIDE_EDIT_INSTALLMENT_MODAL',
  SHOW_ADD_PAYMENT_MODAL = '@@simple/SHOW_ADD_PAYMENT_MODAL',
  HIDE_ADD_PAYMENT_MODAL = '@@simple/HIDE_ADD_PAYMENT_MODAL',
  SHOW_EDIT_PAYMENT_MODAL = '@@simple/SHOW_EDIT_PAYMENT_MODAL',
  HIDE_EDIT_PAYMENT_MODAL = '@@simple/HIDE_EDIT_PAYMENT_MODAL',
  SHOW_ADD_EXPENSE_MODAL = '@@simple/SHOW_ADD_EXPENSE_MODAL',
  HIDE_ADD_EXPENSE_MODAL = '@@simple/HIDE_ADD_EXPENSE_MODAL',
  SHOW_EDIT_EXPENSE_MODAL = '@@simple/SHOW_EDIT_EXPENSE_MODAL',
  HIDE_EDIT_EXPENSE_MODAL = '@@simple/HIDE_EDIT_EXPENSE_MODAL',
  SHOW_ADD_FEE_MODAL = '@@simple/SHOW_ADD_FEE_MODAL',
  HIDE_ADD_FEE_MODAL = '@@simple/HIDE_ADD_FEE_MODAL',
  SHOW_EDIT_FEE_MODAL = '@@simple/SHOW_EDIT_FEE_MODAL',
  HIDE_EDIT_FEE_MODAL = '@@simple/HIDE_EDIT_FEE_MODAL',
  SHOW_PRINT_MODAL = '@@simple/SHOW_PRINT_MODAL',
  HIDE_PRINT_MODAL = '@@simple/HIDE_PRINT_MODAL',
  SET_INSTALLMENTS = '@@simple/SET_INSTALLMENTS',
  SET_PAYMENTS = '@@simple/SET_PAYMENTS',
  SET_PAYMENTS_TOTAL = '@@simple/SET_PAYMENTS_TOTAL',
  SAVE_SIMPLE_CALCULATION = '@@simple/SAVE_SIMPLE_CALCULATION',
  UPDATE_AUTHOR_TOTALS = '@@simple/UPDATE_CALCULATION',
  UPDATE_ACCOUNT_TOTAL = '@@simple/UPDATE_ACCOUNT_TOTAL',
  LIST_ACCOUNTS_BY_TYPE_ID = '@@simple/LIST_ACCOUNTS_BY_TYPE_ID',
  REORDER_INSTALLMENTS_BY_INDEX = '@@simple/REORDER_INSTALLMENTS_BY_INDEX',
  REORDER_INSTALLMENTS_BY_DATE = '@@simple/REORDER_INSTALLMENTS_BY_DATE',
  REGISTER_INSTALLMENT = '@@simple/REGISTER_INSTALLMENT',
  EDIT_INSTALLMENT = '@@simple/EDIT_INSTALLMENT',
  REMOVE_INSTALLMENT = '@@simple/REMOVE_INSTALLMENT',
  REGISTER_INSTALLMENT_INTEREST = '@@simple/REGISTER_INSTALLMENT_INTEREST',
  SET_INTEREST_INDEXES = '@@simple/SET_INTEREST_INDEXES',
  EDIT_INSTALLMENT_INTEREST = '@@simple/EDIT_INSTALLMENT_INTEREST',
  DUPLICATE_INSTALLMENT_INTEREST = '@@simple/DUPLICATE_INSTALLMENT_INTEREST',
  DUPLICATE_INSTALLMENT_FINE = '@@simple/DUPLICATE_INSTALLMENT_FINE',
  REMOVE_INSTALLMENT_INTEREST = '@@simple/REMOVE_INSTALLMENT_INTEREST',
  REGISTER_INSTALLMENT_FINE = '@@simple/REGISTER_INSTALLMENT_FINE',
  EDIT_INSTALLMENT_FINE = '@@simple/EDIT_INSTALLMENT_FINE',
  UPDATE_INSTALLMENT_FINE = '@@simple/UPDATE_INSTALLMENT_FINE',
  REMOVE_INSTALLMENT_FINE = '@@simple/REMOVE_INSTALLMENT_FINE',
  ADD_AUTHOR = '@@simple/ADD_AUTHOR',
  EDIT_AUTHOR = '@@simple/EDIT_AUTHOR',
  DUPLICATE_AUTHOR = '@@simple/DUPLICATE_AUTHOR',
  REMOVE_AUTHOR = '@@simple/REMOVE_AUTHOR',
  REGISTER_PAYMENT = '@@simple/REGISTER_PAYMENT',
  EDIT_PAYMENT = '@@simple/EDIT_PAYMENT',
  REMOVE_PAYMENT = '@@simple/REMOVE_PAYMENT',
  REORDER_PAYMENTS = '@@simple/REORDER_PAYMENTS',
  REGISTER_PAYMENT_INTEREST = '@@simple/REGISTER_PAYMENT_INTEREST',
  EDIT_PAYMENT_INTEREST = '@@simple/EDIT_PAYMENT_INTEREST',
  DUPLICATE_PAYMENT_INTEREST = '@@simple/DUPLICATE_PAYMENT_INTEREST',
  REMOVE_PAYMENT_INTEREST = '@@simple/REMOVE_PAYMENT_INTEREST',
  REGISTER_EXPENSE = '@@simple/REGISTER_EXPENSE',
  EDIT_EXPENSE = '@@simple/EDIT_EXPENSE',
  REMOVE_EXPENSE = '@@simple/REMOVE_EXPENSE',
  REORDER_EXPENSES = '@@simple/REORDER_EXPENSES',
  REGISTER_FEE = '@@simple/REGISTER_FEE',
  EDIT_FEE = '@@simple/EDIT_FEE',
  REMOVE_FEE = '@@simple/REMOVE_FEE',
  REORDER_FEES = '@@simple/REORDER_FEES',
  SET_IS_LOADING = '@@simple/SET_IS_LOADING',
  SEI_IS_LOADING_ENTER = '@@simple/SEI_IS_LOADING_ENTER',
  SEI_IS_LOADING_ERROR = '@@simple/SEI_IS_LOADING_ERROR',
  SEI_IS_LOADING_SUCCESS = '@@simple/SEI_IS_LOADING_SUCCESS',
  SET_SAVE_SIMPLE_CALCULATION_LOADING = '@@simple/SET_SAVE_SIMPLE_CALCULATION_LOADING',
  SET_IS_ISTALLMENT_LOADING = '@@simple/SET_IS_ISTALLMENT_LOADING',
  SET_IS_RECALCULATE_LOADING = '@@simple/SET_IS_RECALCULATE_LOADING',
  SET_IS_ERROR_TO_SAVE_ACCOUNT = '@@simple/SET_IS_ERROR_TO_SAVE_ACCOUNT',
  SET_IS_ACCOUNT_LOADING = '@@simple/SET_IS_ACCOUNT_LOADING',
  SET_IS_CORRECTED = '@@simple/SET_IS_CORRECTED',
  SET_IS_MEMCALC_LOADING = '@@simple/SET_IS_MEMCALC_LOADING',
  RESET_ALL_DATA = '@@simple/RESET_ALL_DATA',
  RESET_DATA = '@@simple/RESET_DATA',
  DUPLICATE_INSTALLMENT = '@@simple/DUPLICATE_INSTALLMENT',
  DUPLICATE_PAYMENT = '@@simple/DUPLICATE_PAYMENT',
  DUPLICATE_EXPENSE = '@@simple/DUPLICATE_EXPENSE',
  DUPLICATE_FEE = '@@simple/DUPLICATE_FEE',
  ON_CHECK_NEW_CPC = '@@simple/ON_CHECK_NEW_CPC',
  SET_ART_523 = '@@simple/SET_ART_523',
  SET_CHECK_ART_523 = '@@simple/SET_CHECK_ART_523',
  RECALCULATE_AUTHORS_SUCCESS = '@@simple/RECALCULATE_AUTHORS_SUCCESS',
  SUBMIT_ART_523 = '@@simple/SUBMIT_ART_523',
  ON_CHECK_ART_523 = '@@simple/ON_CHECK_ART_523',
  SET_ERROR = '@@simple/SET_ERROR',
  RECALCULATE_ACCOUNT = '@@simple/RECALCULATE_ACCOUNT',
  SET_WAS_RECALCULATED = '@@simple/SET_WAS_RECALCULATED',
  RESET_RECALCULATE_CACHE = '@@simple/RESET_RECALCULATE_CACHE',
  CHANGE_FINES_AND_INSTEREST_DATE = '@@simple/CHANGE_FINES_AND_INSTEREST_DATE',
  SET_CALCULATION_MEMORIES = '@@simple/SET_CALCULATION_MEMORIES',
  HANDLE_INDICATOR_CHANGE = '@@simple/HANDLE_INDICATOR_CHANGE',
  LOAD_INDICATOR = '@@simple/LOAD_INDICATOR',
  LIST_MEM_CALCS = '@@simple/LIST_MEM_CALCS',
  SET_MEM_CALC = '@@simple/SET_MEM_CALC',
  SET_IS_RECALCULTATE = '@@simple/SET_IS_RECALCULTATE',
  SET_MEM_CALCS_DB = '@@simple/SET_MEM_CALCS_DB',
  SET_MEM_CALC_HAS_FACTORS = '@@simple/SET_MEM_CALC_HAS_FACTORS',
  STOP_RECALCULATE_ACCOUNT_LOADING_SUCCESS = '@@simple/STOP_RECALCULATE_ACCOUNT_LOADING_SUCCESS',
  SET_CURRENCY = '@@simple/SET_CURRENCY',
}

export interface SimpleState extends AccountDataState {
  readonly account: AccountImp;
  readonly wasSaved: boolean;
  readonly indexId: number;
  readonly accountPagination: PaginateResponseImp;
  readonly error?: string;
}

export interface MemCalcHasFactorsImp {
  db: MemCalcImp[];
  factorsPositive: FactorImp;
  factorsNegative: FactorImp;
  detailedPositive: DetailedImp;
  detailedNegative: DetailedImp;
  indexId: number;
}

export interface AdministrativeNatureCorrectionImpHasFactors extends AdministrativeNatureCorrectionImp {
  factorsPositive?: FactorImp;
  factorsNegative?: FactorImp;
  account: AccountImp;
}

export type AdministrativeNatureCorrectionImpHasFactorsList = AdministrativeNatureCorrectionImpHasFactors[];

export type IRecalculateTypes = typePayment.id | typeExpense.id | typeinstallment.id | typeFee.id;
export interface AccountDataState {
  readonly accounts: DataTableCellImp[] | null;
  readonly wasRecalculated: boolean;
  readonly actions: ActionsImp;
  readonly authors: SimpleAuthorImp[];
  readonly administrativeNatureCorrectionFactors: AdministrativeNatureCorrectionImpHasFactorsList;
  readonly isAccountLoading: boolean;
  readonly errorToSaveAccount: boolean;
  readonly saveSimpleCalculationLoading: boolean;
  readonly isAuthorsLoading: boolean;
  readonly isInstallmentLoading: boolean;
  readonly isRecalculate: boolean;
  readonly total: number;
  readonly loadingMessage?: string;
  readonly positive: boolean;
  readonly recalculateTypes: IRecalculateTypes[];
  readonly art523?: MonetaryFine523Imp;
  readonly isCheckedArt523: boolean;
  readonly expenses: ExpenseImp[];
  readonly fees: FeeImp[];
  readonly expensesTotal: number;
  readonly feesTotal: number;
  readonly installmentsTotal: number;
  readonly installmentsInterestTotal: number;
  readonly installmentsFinesTotal: number;
  readonly paymentsTotal: number;
  readonly calculationMemories: string[];
  readonly isLoading: boolean;
  readonly payments: PaymentImp[];
  readonly installments: SimpleInstallmentImp[];
  readonly isCorrected: boolean;
  readonly isRecalculateLoading: boolean;
  readonly isMemCalcLoading: boolean;
  readonly memCalc: MemCalcImp[];
  readonly currency: string;
  readonly interestIndexes: InterestIndexesImp | null;
}
