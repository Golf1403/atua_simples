import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import SimpleInstallmentImp from '@interfaces/calculations/SimpleInstallmentImp';

export interface EditInstallmentLayoutImp {
  data: SimpleInstallmentImp;
  key: number;
}

export const showAddInstallmentModal = () => action(SimpleActionTypes.SHOW_ADD_INSTALLMENT_MODAL);
export const hideAddInstallmentModal = () => action(SimpleActionTypes.HIDE_ADD_INSTALLMENT_MODAL);

export const showEditInstallmentModal = (payload: EditInstallmentLayoutImp) =>
  action(SimpleActionTypes.SHOW_EDIT_INSTALLMENT_MODAL, payload);
export const hideEditInstallmentModal = () => action(SimpleActionTypes.HIDE_EDIT_INSTALLMENT_MODAL);
