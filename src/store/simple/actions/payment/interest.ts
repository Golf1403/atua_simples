import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';

export const editPaymentInterest = (
  authorIndex: number,
  paymentIndex: number,
  interestIndex: number,
  interest: MonetaryInterestImp
) =>
  action(SimpleActionTypes.EDIT_PAYMENT_INTEREST, {
    authorIndex,
    paymentIndex,
    interestIndex,
    interest,
  });

export const registerPaymentInterest = (authorIndex: number, paymentIndex: number, interest: MonetaryInterestImp) =>
  action(SimpleActionTypes.REGISTER_PAYMENT_INTEREST, {
    authorIndex,
    paymentIndex,
    interest,
  });

export const duplicatePaymentInterest = (
  authorIndex: number,
  paymentIndex: number,
  interestIndex: number,
  interest: MonetaryInterestImp
) =>
  action(SimpleActionTypes.DUPLICATE_PAYMENT_INTEREST, {
    authorIndex,
    paymentIndex,
    interestIndex,
    interest,
  });

export const removePaymentInterest = (authorIndex: number, paymentIndex: number, interestIndex: number) =>
  action(SimpleActionTypes.REMOVE_PAYMENT_INTEREST, {
    authorIndex,
    paymentIndex,
    interestIndex,
  });
