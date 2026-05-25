import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';

export const editInstallmentInterest = (
  authorIndex: number,
  installmentIndex: number,
  interestIndex: number,
  interest: MonetaryInterestImp
) =>
  action(SimpleActionTypes.EDIT_INSTALLMENT_INTEREST, {
    authorIndex,
    installmentIndex,
    interestIndex,
    interest,
  });

export const removeInstallmentInterest = (authorIndex: number, installmentIndex: number, interestIndex: number) =>
  action(SimpleActionTypes.REMOVE_INSTALLMENT_INTEREST, {
    authorIndex,
    installmentIndex,
    interestIndex,
  });

export const registerInstallmentInterest = (
  authorIndex: number,
  installmentIndex: number,
  installmentDate: string,
  interest: MonetaryInterestImp
) =>
  action(SimpleActionTypes.REGISTER_INSTALLMENT_INTEREST, {
    authorIndex,
    installmentIndex,
    installmentDate,
    interest,
  });

export const duplicateInstallmentInterest = (
  authorIndex: number,
  installmentIndex: number,
  interestIndex: number,
  interest: MonetaryInterestImp
) => {
  return action(SimpleActionTypes.DUPLICATE_INSTALLMENT_INTEREST, {
    authorIndex,
    installmentIndex,
    interestIndex,
    interest,
  });
};
