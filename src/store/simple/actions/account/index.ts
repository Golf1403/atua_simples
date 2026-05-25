//account

import { action } from 'typesafe-actions';
import { ActionsImp, SimpleActionTypes } from '../../types';
import AccountImp from '@interfaces/AccountImp';
import { DataTableCellImp } from '@interfaces/DataTableImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import PaginateResponseImp from '@interfaces/PaginateResponseImp';
import { IndexResponseImp } from '@interfaces/serviceResponses/IndexResponseImp';

export const setTotal = (payload: number) => action(SimpleActionTypes.SET_ACCOUNT_TOTAL, payload);

export const setAccount = (payload: AccountImp) => action(SimpleActionTypes.SET_ACCOUNT, payload);

export const setIndexId = (payload: number) => action(SimpleActionTypes.SET_INDEX_ID, payload);

export const setAccounts = (payload: DataTableCellImp[] | null) => action(SimpleActionTypes.SET_ACCOUNTS, payload);

export const setPositive = (payload: boolean) => action(SimpleActionTypes.SET_POSITIVE, payload);

export const setWasSavedAccount = (payload: boolean) => action(SimpleActionTypes.SET_WAS_SAVED_ACCOUNT, payload);

export const setInterestIndexes = (payload: InterestIndexesImp) =>
  action(SimpleActionTypes.SET_INTEREST_INDEXES, payload);

export const setAccountPagination = (payload: PaginateResponseImp) => {
  return action(SimpleActionTypes.SET_ACCOUNT_PAGINATION, payload);
};

export const setWasRecalculate = (payload: boolean) => action(SimpleActionTypes.SET_WAS_RECALCULATED, payload);

export const recalculateAccount = (type: string | string[], account: AccountImp) =>
  action(SimpleActionTypes.RECALCULATE_ACCOUNT, { type, account });

export const changeFineAndInterestDate = (changeFinesDate: boolean, lastAccountUpdateTo: string) =>
  action(SimpleActionTypes.CHANGE_FINES_AND_INSTEREST_DATE, { changeFinesDate, lastAccountUpdateTo });

export const handleIndicatorChange = (payload: IndexResponseImp) =>
  action(SimpleActionTypes.HANDLE_INDICATOR_CHANGE, payload);

export const setIsRecalculate = (payload: boolean) => action(SimpleActionTypes.SET_IS_RECALCULTATE, payload);

type WithAuthorType = 'installment' | 'payment';
type FromType = WithAuthorType | 'fee' | 'expense';
type ActionType = 'add' | 'edit';

export const setVisibilityActions = (actions: ActionsImp, type: ActionType, from: FromType) => {
  return action(SimpleActionTypes.SET_ACTIONS, {
    ...actions,
    [type]: { ...actions[type], [from]: { ...actions.add[from], visible: false } },
  });
};

export const setSimpleActions = (payload: ActionsImp) => {
  return action(SimpleActionTypes.SET_ACTIONS, payload);
};

export const setCalculationMemories = (payload: string[]) =>
  action(SimpleActionTypes.SET_CALCULATION_MEMORIES, payload);

export const saveSimpleCalculation = (isNewAccount?: boolean) =>
  action(SimpleActionTypes.SAVE_SIMPLE_CALCULATION, isNewAccount);

export const resetAllSimpleData = () => action(SimpleActionTypes.RESET_DATA);

export const listAccountsByTypeId = (payload: {
  typeId: number;
  page?: number;
  search?: string;
  paginate?: PaginateResponseImp;
}) => action(SimpleActionTypes.LIST_ACCOUNTS_BY_TYPE_ID, payload);

export const setError = (payload: string) => action(SimpleActionTypes.SET_ERROR, payload);

export const closeError = () => action(SimpleActionTypes.SET_ERROR, '');

export const setCurrency = (payload: string) => action(SimpleActionTypes.SET_CURRENCY, payload);

export * from './layout';
