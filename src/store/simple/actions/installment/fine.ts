import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import { SimpleInstallmentFineImp } from '@interfaces/calculations/SimpleInstallmentImp';
import MonetaryFineImp from '@interfaces/calculations/MonetaryFineImp';

export const editInstallmentFine = (
  authorIndex: number,
  installmentIndex: number,
  fineIndex: number,
  fine: MonetaryFineImp
) =>
  action(SimpleActionTypes.EDIT_INSTALLMENT_FINE, {
    authorIndex,
    installmentIndex,
    fineIndex,
    fine,
  });

export const updateInstallmentFines = (authorIndex: number, installmentIndex: number) =>
  action(SimpleActionTypes.UPDATE_INSTALLMENT_FINE, {
    authorIndex,
    installmentIndex,
  });

export const removeInstallmentFine = (authorIndex: number, installmentIndex: number, fineIndex: number) =>
  action(SimpleActionTypes.REMOVE_INSTALLMENT_FINE, {
    authorIndex,
    installmentIndex,
    fineIndex,
  });

export const registerInstallmentFine = (authorIndex: number, installmentIndex: number, fine: MonetaryFineImp) =>
  action(SimpleActionTypes.REGISTER_INSTALLMENT_FINE, {
    authorIndex,
    installmentIndex,
    fine,
  });

export const duplicateInstallmentFine = (
  authorIndex: number,
  installmentIndex: number,
  fineIndex: number,
  fine: SimpleInstallmentFineImp
) =>
  action(SimpleActionTypes.DUPLICATE_INSTALLMENT_FINE, {
    authorIndex,
    installmentIndex,
    fineIndex,
    fine,
  });
