import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import PaymentImp from '@interfaces/calculations/PaymentImp';

export interface EditPaymentLayoutImp {
  data: PaymentImp;
  key: number;
}

export const showAddPaymentModal = () => action(SimpleActionTypes.SHOW_ADD_PAYMENT_MODAL);
export const hideAddPaymentModal = () => action(SimpleActionTypes.HIDE_ADD_PAYMENT_MODAL);
export const showEditPaymentModal = (payload: EditPaymentLayoutImp) =>
  action(SimpleActionTypes.SHOW_EDIT_PAYMENT_MODAL, payload);
export const hideEditPaymentModal = () => action(SimpleActionTypes.HIDE_EDIT_PAYMENT_MODAL);
