//fee

import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';

import FeeImp from '@interfaces/calculations/FeeImp';

export const setFees = (payload: FeeImp[]) => action(SimpleActionTypes.SET_FEES, payload);

export const editFee = (fee: FeeImp, feeIndex: number) => action(SimpleActionTypes.EDIT_FEE, { fee, feeIndex });

export const removeFee = (feeIndex: number) => action(SimpleActionTypes.REMOVE_FEE, { feeIndex });

export const registerFee = (fee: FeeImp) => action(SimpleActionTypes.REGISTER_FEE, { fee });

export const reorderFees = (fees: FeeImp[], startIndex: number, endIndex: number) =>
  action(SimpleActionTypes.REORDER_FEES, { fees, startIndex, endIndex });

export const duplicateFee = (payload: number) => action(SimpleActionTypes.DUPLICATE_FEE, { feeIndex: payload });

export const setFeesTotal = (payload: number) => action(SimpleActionTypes.SET_FEES_TOTAL, payload);

export const onCheckNewCpc = (feeIndex: number, isChecked: boolean) =>
  action(SimpleActionTypes.ON_CHECK_NEW_CPC, { feeIndex, isChecked });

export * from './layout';
