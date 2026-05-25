import { action } from 'typesafe-actions';
import PaymentImp from '@interfaces/calculations/PaymentImp';
import { SimpleActionTypes } from '../../types';

//payment

export const editPayment = (authorIndex: number, payment: PaymentImp, paymentIndex: number) =>
  action(SimpleActionTypes.EDIT_PAYMENT, { authorIndex, payment, paymentIndex });

export const removePayment = (authorIndex: number, paymentIndex: number) =>
  action(SimpleActionTypes.REMOVE_PAYMENT, { authorIndex, paymentIndex });

export const registerPayment = (authorIndex: number, payment: PaymentImp) =>
  action(SimpleActionTypes.REGISTER_PAYMENT, { authorIndex, payment });

export const reorderPayments = (payments: PaymentImp[], startIndex: number, endIndex: number, authorIndex: number) =>
  action(SimpleActionTypes.REORDER_PAYMENTS, { payments, startIndex, endIndex, authorIndex });

export const duplicatePayment = (authorIndex: number, paymentIndex: number) =>
  action(SimpleActionTypes.DUPLICATE_PAYMENT, { authorIndex, paymentIndex });

export const setPaymentsTotal = (payload: number) => action(SimpleActionTypes.SET_PAYMENTS_TOTAL, payload);

export * from './interest';
export * from './layout';
