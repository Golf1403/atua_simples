import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import ExpenseImp from '@interfaces/calculations/ExpenseImp';

export interface EditExpenseLayoutImp {
  data: ExpenseImp;
  key: number;
}

export const showAddExpenseModal = () => action(SimpleActionTypes.SHOW_ADD_EXPENSE_MODAL);
export const hideAddExpenseModal = () => action(SimpleActionTypes.HIDE_ADD_EXPENSE_MODAL);
export const showEditExpenseModal = (payload: EditExpenseLayoutImp) =>
  action(SimpleActionTypes.SHOW_EDIT_EXPENSE_MODAL, payload);
export const hideEditExpenseModal = () => action(SimpleActionTypes.HIDE_EDIT_EXPENSE_MODAL);
