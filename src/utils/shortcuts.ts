import { Dispatch } from 'redux';
import {
  typeCtrlB,
  typeCtrlF1,
  typeCtrlF2,
  typeCtrlF3,
  typeCtrlF6,
  typeCtrlF7,
  typeCtrlF8,
  typeCtrlF10,
  typeCtrlF12,
  typeCtrlShiftF3,
  typeCtrlShiftF6,
  typeCtrlShiftF7,
  typeCtrlShiftF8,
  typeCtrlF11,
  typeCtrlDel,
} from '@/data/calculations/shortcutsTypes';
import IDummyObject from '@interfaces/IDummyObject';
import { editCurrentAccountPage, newCurrentAccountPage, newSimpleUpdatePage } from '../Routes/pages/calculations';
import { showAddFeeModal } from '@store/simple/actions';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import { typeExpense, typeFee, typeinstallment, typePayment } from '@/hooks/interfaces/CurrentAccountHookImp';

const cancellDefault = (event: KeyboardEvent) => {
  // event.cancelable = true;
  event.preventDefault();
  event.stopPropagation();
};

export const simpleAccountList = async (event: KeyboardEvent, history: IDummyObject) => {
  if (!event.ctrlKey) return;

  switch (event.keyCode) {
    case typeCtrlF1.id:
      console.info(`onpress_${typeCtrlF1.name}`);
      cancellDefault(event);
      history.push(newSimpleUpdatePage.path, { reset: true, saveAndReset: false });
      return;
  }
};

export const simpleAccount = async (event: KeyboardEvent, history: IDummyObject, dispatch: Dispatch) => {
  switch (event.keyCode) {
    case typeCtrlF2.id:
      console.info(`onpress_${typeCtrlF2.name}`);
      cancellDefault(event);
      // dispatch(showAuthorModal());
      return;
    case typeCtrlF3.id:
      console.info(`onpress_${typeCtrlF3.name}`);
      cancellDefault(event);
      // dispatch(showAddInstallmentModal());
      return;
    case typeCtrlF6.id:
      console.info(`onpress_${typeCtrlF6.name}`);
      cancellDefault(event);
      // dispatch(showAddPaymentModal());
      return;
    case typeCtrlF7.id:
      console.info(`onpress_${typeCtrlF7.name}`);
      cancellDefault(event);
      // dispatch(showAddExpenseModal());
      return;
    case typeCtrlF8.id:
      console.info(`onpress_${typeCtrlF8.name}`);
      cancellDefault(event);
      dispatch(showAddFeeModal());
      return;
    case typeCtrlF10.id:
      console.info(`onpress_${typeCtrlF10.name}`);
      cancellDefault(event);
      // dispatch(showPrintModal());
      return;
    case typeCtrlF12.id:
      console.info(`onpress_${typeCtrlF12.name}`);
      cancellDefault(event);
      // dispatch(saveSimpleCalculation(false));
      return;
  }
};

export const currentAccount = async ({
  event,
  history,
  addAuthor,
  addOccurrence,
  addExpense,
  print,
  viewer,
  deleteAll,
}: {
  event: KeyboardEvent;
  history: IDummyObject;
  addAuthor: Function;
  addOccurrence: Function;
  addExpense: Function;
  print: Function;
  viewer: Function;
  deleteAll: Function;
}) => {
  if (!event.ctrlKey) return;

  switch (event.keyCode) {
    case typeCtrlF1.id:
      console.info(`onpress_${typeCtrlF1.name}`);
      cancellDefault(event);
      setTimeout(() => {
        history.push(newCurrentAccountPage.path, { force: false, reset: true });
      }, timeoutEnum.DEFAULT_TIMEOUT);
      return;
    case typeCtrlF2.id:
      console.info(`onpress_${typeCtrlF2.name}`);
      if (
        [editCurrentAccountPage.path.split('/edit/')[0] + '/edit/'].some(path => location.pathname.startsWith(path))
      ) {
        addAuthor();
      }
      if (newCurrentAccountPage.path.includes(location.pathname)) addAuthor();
      cancellDefault(event);
      return;
    case typeCtrlF3.id:
      if (event.shiftKey) {
        console.info(`onpress_${typeCtrlShiftF3.name}`);
        addOccurrence({ type: typeinstallment.id, isStart: false });
        cancellDefault(event);
        return;
      }
      console.info(`onpress_${typeCtrlF3.name}`);
      addOccurrence({ type: typeinstallment.id });
      cancellDefault(event);
      return;
    case typeCtrlF6.id:
      if (event.shiftKey) {
        console.info(`onpress_${typeCtrlShiftF6.name}`);
        addOccurrence({ type: typePayment.id, isStart: false });
        cancellDefault(event);
        return;
      }
      console.info(`onpress_${typeCtrlF6.name}`);
      addOccurrence({ type: typePayment.id });
      cancellDefault(event);
      return;
    case typeCtrlF7.id:
      if (event.shiftKey) {
        console.info(`onpress_${typeCtrlShiftF7.name}`);
        addOccurrence({ type: typeExpense.id });
        cancellDefault(event);
        return;
      }
      console.info(`onpress_${typeCtrlF7.name}`);
      addExpense();
      cancellDefault(event);
      return;
    case typeCtrlF8.id:
      if (event.shiftKey) {
        console.info(`onpress_${typeCtrlShiftF8.name}`);
        addOccurrence({ type: typeFee.id, isStart: false });
        cancellDefault(event);
        return;
      }
      console.info(`onpress_${typeCtrlF8.name}`);
      addOccurrence({ type: typeFee.id });
      cancellDefault(event);
      return;
    case typeCtrlF10.id:
      console.info(`onpress_${typeCtrlF10.name}`);
      print();
      cancellDefault(event);
      return;
    case typeCtrlF11.id:
      console.info(`onpress_${typeCtrlF10.name}`);
      viewer();
      cancellDefault(event);
      return;
    case typeCtrlDel.id:
      console.info(`onpress_${typeCtrlDel.name}`);
      cancellDefault(event);
      deleteAll();
      return;
  }
};
export const layout = async (event: KeyboardEvent, toggle: () => void) => {
  if (!event.ctrlKey) return;

  switch (event.keyCode) {
    case typeCtrlB.id:
      console.info(`onpress_${typeCtrlB.name}`);
      cancellDefault(event);
      toggle();
      return;
  }
};
