import _ from 'lodash';
import { Reducer } from 'redux';
import { SimpleState, SimpleActionTypes } from './types';
import PaginateResponseImp from '@interfaces/PaginateResponseImp';

import { initialActions } from './payload';
import { CoreActionTypes } from '../core/types';
import { IndexEnum } from '@/enums/IndexEnum';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import AccountImp from '@/interfaces/AccountImp';
import { typeExpense, typeFee, typePayment, typeinstallment } from '@/hooks/interfaces/CurrentAccountHookImp';
import { indexNegative } from '@/data/generalData/indexNegativeRadioOptions';

export const initialAccountPagination: PaginateResponseImp = {
  current: 1,
  pages: 1,
  order: 'asc',
  orderBy: 'name',
  total: 1,
};

export const authorRow = {
  authorIndex: 0,
  currency: 'R$',
};

export const initialAccountValue: AccountImp = {
  id: '',
  accountTypeId: 1,
  costCenterId: '',
  name: 'Nome do cálculo',
  deflation: indexNegative.id,
  indexId: IndexEnum.CDI_INDEX,
  observation: '',
  proRataDay: false,
  proRataOtn: false,
  recordId: '',
  courtId: '',
  defendantId: '',
  positive: false,
  updateTo: moment().format(dateFormatEnum.DEFAULT),
};

const initialState: SimpleState = {
  account: initialAccountValue,
  indexId: 0,
  wasRecalculated: false,
  isRecalculate: false,
  accountPagination: initialAccountPagination,
  administrativeNatureCorrectionFactors: [],
  wasSaved: false,
  errorToSaveAccount: false,
  saveSimpleCalculationLoading: false,
  authors: [],
  isAuthorsLoading: false,
  accounts: null,
  isRecalculateLoading: false,
  isInstallmentLoading: false,
  total: 0,
  isLoading: false,
  positive: false,
  loadingMessage: '',
  isCorrected: false,
  isCheckedArt523: false,
  expenses: [],
  fees: [],
  expensesTotal: 0,
  feesTotal: 0,
  payments: [],
  installments: [],
  recalculateTypes: [],
  installmentsTotal: 0,
  installmentsFinesTotal: 0,
  installmentsInterestTotal: 0,
  paymentsTotal: 0,
  calculationMemories: [],
  memCalc: [],
  isMemCalcLoading: false,
  currency: 'R$',
  interestIndexes: null,
  isAccountLoading: false,
  actions: initialActions,
};

const reducer: Reducer<SimpleState> = (state = initialState, action) => {
  const { type, payload } = action;
  const { recalculateTypes } = state;

  switch (type) {
    case SimpleActionTypes.SET_ACTIONS:
      return { ...state, actions: payload };
    case SimpleActionTypes.SET_INDEX_ID:
      return { ...state, indexId: payload };
    case SimpleActionTypes.RESET_RECALCULATE_CACHE:
      return { ...state, recalculateTypes: [] };
    case SimpleActionTypes.SET_IS_RECALCULTATE:
      return { ...state, isRecalculate: payload };
    case SimpleActionTypes.SET_INSTALLMENTS:
      return { ...state, installments: payload, recalculateTypes: [...recalculateTypes, typeinstallment.id] };
    case SimpleActionTypes.SET_WAS_RECALCULATED:
      return { ...state, wasRecalculated: payload };
    case SimpleActionTypes.SET_INSTALLMENTS_TOTAL:
      return {
        ...state,
        installmentsTotal: payload.installmentsTotal,
        installmentsInterestTotal: payload.installmentsInterestTotal,
        installmentsFinesTotal: payload.installmentsFinesTotal,
        isCorrected: false,
      };
    case SimpleActionTypes.SET_PAYMENTS:
      return { ...state, payments: payload, recalculateTypes: [...recalculateTypes, typePayment.id] };
    case SimpleActionTypes.SET_PAYMENTS_TOTAL:
      return { ...state, paymentsTotal: payload };
    case SimpleActionTypes.SET_ACCOUNT:
      return { ...state, account: payload };
    case SimpleActionTypes.SET_ACCOUNTS:
      return { ...state, accounts: payload };
    case SimpleActionTypes.SET_AUTHORS:
      return { ...state, authors: payload };
    case SimpleActionTypes.SET_IS_ERROR_TO_SAVE_ACCOUNT:
      return { ...state, errorToSaveAccount: payload };
    case SimpleActionTypes.SET_INTEREST_INDEXES:
      return { ...state, interestIndexes: payload };
    case SimpleActionTypes.SET_FEES:
      return { ...state, fees: payload, recalculateTypes: [...recalculateTypes, typeFee.id] };
    case SimpleActionTypes.SET_FEES_TOTAL:
      return { ...state, feesTotal: payload };
    case SimpleActionTypes.SET_EXPENSES:
      return { ...state, expenses: payload, recalculateTypes: [...recalculateTypes, typeExpense.id] };
    case SimpleActionTypes.SET_EXPENSES_TOTAL:
      return { ...state, expensesTotal: payload };
    case SimpleActionTypes.SET_POSITIVE:
      return { ...state, positive: payload };
    case SimpleActionTypes.SET_ACCOUNT_PAGINATION:
      return { ...state, accountPagination: payload };
    case SimpleActionTypes.SET_IS_CORRECTED:
      return { ...state, isCorrected: false };
    case SimpleActionTypes.SET_ACCOUNT_TOTAL:
      return { ...state, total: payload, isCorrected: false };
    case SimpleActionTypes.SET_CHECK_ART_523:
      return { ...state, isCheckedArt523: payload };
    case SimpleActionTypes.SET_ART_523:
      return { ...state, art523: payload };
    case SimpleActionTypes.SET_ERROR:
      return { ...state, error: payload };
    case SimpleActionTypes.SET_CALCULATION_MEMORIES:
      return { ...state, calculationMemories: payload };
    case SimpleActionTypes.SET_MEM_CALC:
      return { ...state, memCalc: payload };
    case SimpleActionTypes.SET_NATURE_ADMINISTRATIVE_HAS_FACTORS:
      return { ...state, administrativeNatureCorrectionFactors: payload };
    case SimpleActionTypes.SET_CURRENCY:
      return { ...state, currency: payload };
    case SimpleActionTypes.SET_WAS_SAVED_ACCOUNT:
      return { ...state, wasSaved: payload };
    case SimpleActionTypes.RESET_DATA:
      return _.cloneDeep({
        ...initialState,
        account: {
          ...initialState.account,
          indexId: initialState.account.indexId,
          updateTo: moment().format(dateFormatEnum.DEFAULT),
          costCenterId: state.account.costCenterId,
          costCenterName: state.account.costCenterName,
        },
        accounts: state.accounts,
        accountPagination: state.accountPagination,
        calculationMemories: state.calculationMemories,
        indexId: initialState.account.indexId,
        interestIndexes: state.interestIndexes,
        memCalc: state.memCalc,
      });

    case CoreActionTypes.RESET_ALL_DATA: {
      return { ...initialState, memCalc: state.memCalc };
    }

    default:
      return state;
  }
};

export { reducer as simpleReducer };
