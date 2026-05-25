import { Dispatch } from 'redux';
import { ActionsImp } from './types';
import PaginateResponseImp from '@interfaces/PaginateResponseImp';
import ExpenseImp from '@interfaces/calculations/ExpenseImp';
import { editFee, registerFee } from './actions';
import SimpleInstallmentImp from '@interfaces/calculations/SimpleInstallmentImp';
import AccountImp from '@interfaces/AccountImp';
import PaymentImp from '@interfaces/calculations/PaymentImp';
import FeeImp from '@interfaces/calculations/FeeImp';

export const initialAccountPagination: PaginateResponseImp = {
  current: 1,
  pages: 1,
  order: 'asc',
  orderBy: 'name',
  total: 1,
};

export const initialActions: ActionsImp = {
  account: { active: null, save: false },
  print: {
    modal: {
      visible: false,
    },
    submit: function () {
      console.info('submit_print');
    },
  },
  add: {
    installment: {
      authorIndex: 0,
      modal: { visible: false },
      submit: function (installmentData: SimpleInstallmentImp, account: AccountImp, dispatch: Dispatch) {},
    },
    payment: {
      authorIndex: 0,
      modal: { visible: false },
      submit: async function (paymentData: PaymentImp, dispatch: Dispatch) {
        if (this.authorIndex != null) {
          console.info('submit_add_payment');
        }
      },
    },
    fee: {
      modal: { visible: false },
      submit: async function (fee: FeeImp, dispatch: Dispatch) {
        dispatch(registerFee(fee));
      },
    },
    expense: {
      modal: { visible: false },
      submit: async function (expenseData: ExpenseImp, dispatch: Dispatch) {
        console.info('submit_add_expense');
      },
    },
  },
  author: {
    active: null,
    lastIndex: 0,
    index: 0,
    modal: {
      add: false,
      edit: false,
    },
  },
  edit: {
    installment: {
      modal: {
        visible: false,
      },
      authorIndex: 0,
      active: null,
      key: -1,
    },
    payment: {
      authorIndex: 0,
      active: null,
      modal: {
        visible: false,
      },
      key: -1,
    },
    fee: {
      active: null,
      modal: {
        visible: false,
      },
      key: -1,
      submit: function (feeData: FeeImp, dispatch: Dispatch) {
        console.info('submit_edit_fee');
        dispatch(editFee(feeData, this.key));
      },
    },
    expense: {
      active: null,
      modal: {
        visible: false,
      },
      key: -1,
      submit: function (expenseData: ExpenseImp, dispatch: Dispatch) {
        console.info('submit_edit_expense');
      },
    },
  },
};
