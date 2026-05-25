import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import FeeImp from '@interfaces/calculations/FeeImp';

export interface EditFeeLayoutImp {
  data: FeeImp;
  key: number;
}

export const showAddFeeModal = () => action(SimpleActionTypes.SHOW_ADD_FEE_MODAL);
export const hideAddFeeModal = () => action(SimpleActionTypes.HIDE_ADD_FEE_MODAL);
export const showEditFeeModal = (payload: EditFeeLayoutImp) => action(SimpleActionTypes.SHOW_EDIT_FEE_MODAL, payload);
export const hideEditFeeModal = () => action(SimpleActionTypes.HIDE_EDIT_FEE_MODAL);
