//expense

import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';

import ExpenseImp from '@interfaces/calculations/ExpenseImp';

export const setExpenses = (payload: ExpenseImp[]) => action(SimpleActionTypes.SET_EXPENSES, payload);

export const editExpense = (expense: ExpenseImp, expenseIndex: number) =>
  action(SimpleActionTypes.EDIT_EXPENSE, { expense, expenseIndex });

export const removeExpense = (payload: number) => action(SimpleActionTypes.REMOVE_EXPENSE, { expenseIndex: payload });

export const registerExpense = (payload: ExpenseImp) =>
  action(SimpleActionTypes.REGISTER_EXPENSE, { expense: payload });

export const reorderExpenses = (expenses: ExpenseImp[], startIndex: number, endIndex: number) =>
  action(SimpleActionTypes.REORDER_EXPENSES, { expenses, startIndex, endIndex });

export const setExpensesTotal = (payload: number) => action(SimpleActionTypes.SET_EXPENSES_TOTAL, payload);

export const duplicateExpense = (payload: number) =>
  action(SimpleActionTypes.DUPLICATE_EXPENSE, { expenseIndex: payload });

export * from './layout';
