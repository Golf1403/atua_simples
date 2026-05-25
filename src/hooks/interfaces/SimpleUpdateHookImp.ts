import React from 'react';
import AccountImp from '@/interfaces/AccountImp';
import IDummyObject from '@/interfaces/IDummyObject';
import PaginateResponseImp from '@/interfaces/PaginateResponseImp';
import ExpenseImp from '@/interfaces/calculations/ExpenseImp';
import FeeImp from '@/interfaces/calculations/FeeImp';
import MonetaryFine523Imp from '@/interfaces/calculations/MonetaryFine523Imp';
import MonetaryFineImp from '@/interfaces/calculations/MonetaryFineImp';
import MonetaryInterestImp from '@/interfaces/calculations/MonetaryInterestImp';
import PaymentImp from '@/interfaces/calculations/PaymentImp';
import SimpleAuthorImp from '@/interfaces/calculations/SimpleAuthorImp';
import SimpleInstallmentImp, { SimpleInstallmentFineImp } from '@/interfaces/calculations/SimpleInstallmentImp';
import { IndexResponseImp } from '@/interfaces/serviceResponses/IndexResponseImp';
import { EditAuthorLayoutImp } from '@/store/simple/actions';
import { MemCalcHasFactorsImp } from '@/store/simple/types';
import CalculationsResponseImp from '@/interfaces/serviceResponses/CalculationsResponseImp';
import { CurrentAccountImp, LayoutImp } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import { SummaryImp } from '@/interfaces/calculations/ViewOccorrenceImp';
import INomenclature from '@/interfaces/NomenclatureImp';
import MemCalcImp from '@/interfaces/MemCalcImp';

export interface SimpleUpdateHookImp {
  listAccountsByTypeId: (payload: {
    page: number;
    paginate: PaginateResponseImp;
    search: string;
  }) => Promise<CalculationsResponseImp>;
  newAccount: () => Promise<void>;
  registerInstallment: (payload: { authorIndex: number; installment: SimpleInstallmentImp }) => Promise<void>;
  editInstallment: (payload: {
    authorIndex: number;
    installment: SimpleInstallmentImp;
    installmentIndex: number;
    changeFinesDate: boolean;
  }) => Promise<void>;
  removeInstallment: (payload: { authorIndex: number; installmentIndex: number }) => Promise<void>;
  duplicateInstallment: (payload: { authorIndex: number; installmentIndex: number }) => Promise<void>;
  reorderInstallmentsByIndex: (payload: {
    installments: SimpleInstallmentImp[];
    startIndex: number;
    endIndex: number;
    authorIndex: number;
  }) => void;
  reorderInstallmentsByDate: (payload: {
    installments: SimpleInstallmentImp[];
    orderByDesc: boolean;
    authorIndex: number;
  }) => void;
  submitArt523: (payload: { art523: MonetaryFine523Imp; isChecked: boolean }) => Promise<void>;
  onCheckArt523: (payload: { isChecked: boolean }) => void;
  handleIndicatorChange: (payload: IndexResponseImp) => void;
  hidePrintModal: () => void;
  showPrintModal: () => void;
  duplicateInstallmentFine: (payload: {
    authorIndex: number;
    fine: SimpleInstallmentFineImp;
    fineIndex: number;
    installmentIndex: number;
  }) => Promise<void>;
  registerInstallmentFine: (payload: {
    authorIndex: number;
    installmentIndex: number;
    fine: MonetaryFineImp;
  }) => Promise<void>;
  removeInstallmentFine: (param: { authorIndex: number; installmentIndex: number; fineIndex: number }) => Promise<void>;
  updateInstallmentFines: (payload: { authorIndex: number; installmentIndex: number }) => Promise<void>;
  registerInstallmentInterest: (payload: {
    authorIndex: number;
    installmentIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  editInstallmentInterest: (payload: {
    authorIndex: number;
    installmentIndex: number;
    interestIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  duplicateInstallmentInterest: (payload: {
    authorIndex: number;
    installmentIndex: number;
    interestIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  removeInstallmentInterest: (payload: {
    authorIndex: number;
    installmentIndex: number;
    interestIndex: number;
  }) => Promise<void>;
  showAddInstallmentModal: () => void;
  hideAddInstallmentModal: () => void;
  editInstallmentFine: (payload: {
    authorIndex: number;
    installmentIndex: number;
    fineIndex: number;
    fine: MonetaryFineImp;
  }) => Promise<void>;
  showEditInstallmentModal: (param: { data: SimpleInstallmentImp | null; key: number }) => void;
  hideEditInstallmentModal: () => void;
  showAuthorModal: () => void;
  showEditAuthorModal: (param: EditAuthorLayoutImp) => void;
  hideAuthorModal: () => void;
  addAuthor: (payload: { author: SimpleAuthorImp; authors: SimpleAuthorImp[] }) => void;
  removeAuthor: (payload: { authorIndex: number; authors: SimpleAuthorImp[] }) => void;
  onRemoveAuthor: (payload: { authorIndex: number; authors?: SimpleAuthorImp[] }) => void;
  editAuthor: (payload: { authorIndex: number; authors: SimpleAuthorImp[]; author: SimpleAuthorImp }) => void;
  duplicateAuthor: (payload: { authorIndex: number; authors: SimpleAuthorImp[] }) => void;
  onDuplicateAuthor: (payload: { authorIndex: number; authors?: SimpleAuthorImp[] }) => void;
  showAddFeeModal: () => void;
  hideAddFeeModal: () => void;
  showEditFeeModal: (param: { data: FeeImp | null; key: number }) => void;
  hideEditFeeModal: () => void;
  registerFee: (param: { fee: FeeImp }) => Promise<void>;
  editFee: (param: { fee: FeeImp; feeIndex: number }) => Promise<void>;
  removeFee: (payload: { feeIndex: number }) => void;
  onCheckNewCpc: (payload: { feeIndex: number; isChecked: boolean }) => void;
  duplicateFee: (payload: { feeIndex: number }) => Promise<void>;
  reorderFees: (payload: { fees: FeeImp[]; startIndex: number; endIndex: number }) => void;
  registerExpense: (payload: { expense: ExpenseImp }) => Promise<void>;
  recalculateAttorneyFees: (installmentsWithFeesTotal: number, fees: FeeImp[]) => void;
  editExpense: (payload: { expense: ExpenseImp; expenseIndex: number }) => Promise<void>;
  removeExpense: (payload: { expenseIndex: number }) => void;
  duplicateExpense: (payload: { expenseIndex: number }) => Promise<void>;
  reorderExpenses: (payload: { expenses: ExpenseImp[]; startIndex: number; endIndex: number }) => void;
  showAddExpenseModal: () => void;
  hideAddExpenseModal: () => void;
  showEditExpenseModal: (param: { data: ExpenseImp | null; key: number }) => void;
  hideEditExpenseModal: () => void;
  showAddPaymentModal: () => void;
  hideAddPaymentModal: () => void;
  showEditPaymentModal: (param: IDummyObject) => void;
  hideEditPaymentModal: () => void;
  registerPayment: (payload: { authorIndex: number; payment: PaymentImp }) => Promise<void>;
  editPayment: (payload: { authorIndex: number; paymentIndex: number; payment: PaymentImp }) => Promise<void>;
  removePayment: (payload: { authorIndex: number; paymentIndex: number }) => Promise<void>;
  duplicatePayment: (payload: { authorIndex: number; paymentIndex: number }) => Promise<void>;
  reorderPayments: (payload: {
    payments: PaymentImp[];
    startIndex: number;
    endIndex: number;
    authorIndex: number;
  }) => void;
  duplicatePaymentInterest: (payload: {
    authorIndex: number;
    paymentIndex: number;
    interestIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  editPaymentInterest: (payload: {
    authorIndex: number;
    paymentIndex: number;
    interestIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  removePaymentInterest: (payload: {
    authorIndex: number;
    paymentIndex: number;
    interestIndex: number;
  }) => Promise<void>;
  registerPaymentInterest: (payload: {
    authorIndex: number;
    paymentIndex: number;
    interest: MonetaryInterestImp;
  }) => Promise<void>;
  updateAuthorTotals: (payload: { authorIndex: number; authors: SimpleAuthorImp[] }) => void;
  updateAccountTotal: () => void;
  saveSimpleCalculation: (payload: boolean) => Promise<void>;
  onSave: (payload: { isNewAccount: boolean }) => void;
  onCalc: (values: {
    origin: 'view' | 'calc';
    nomenclatures: INomenclature[];
    memcalcs?: MemCalcImp[];
  }) => Promise<void>;
  calculateArt523: (
    art523: MonetaryFine523Imp,
    expenses: ExpenseImp[],
    feesTotal: number,
    paymentsTotal: number,
    installmentsTotal: number,
    installmentsInterestTotal: number,
    installmentsFinesTotal: number
  ) => void;
  recalculateAccount: (param: { type: string[]; account: AccountImp }) => Promise<void>;
  recalculateAllAccount: (account: AccountImp) => Promise<void>;
  validateCalculationPeriod: (date: string) => void;
  account: CurrentAccountImp;
  setAccount: React.Dispatch<React.SetStateAction<CurrentAccountImp>>;
  layout: LayoutImp;
  setLayout: React.Dispatch<React.SetStateAction<LayoutImp>>;
  author: { list: CurrentAuthorImp[]; pagination: any };
  setAuthor: React.Dispatch<React.SetStateAction<{ list: CurrentAuthorImp[]; pagination: any }>>;
  help: { [key: string]: { link: string | undefined; text: string | undefined; minWidth: string } };
  setHelp: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { link: string | undefined; text: string | undefined; minWidth: string };
    }>
  >;
  summary: SummaryImp[];
  lastUpdateTo: string;
  setLastUpdateTo: React.Dispatch<React.SetStateAction<string>>;
  setUpdateTo: (value: string) => void;
  toggleUpdateToModal: (visible: boolean) => void;
  onRegisterOccurrence: (params: { type: string; newestOccurrence: boolean }) => void;
  setOccurrence: (payload: { occurrence: any; occurrenceIndex: number; authorIndex?: number }) => void;
  onDuplicateOccurrence: (payload: { occurrenceIndex: number; authorIndex?: number }) => void;
  onRemoveOccurrence: (payload: { occurrenceIndex: number; authorIndex?: number }) => void;
  setExpense: (payload: { expense: any; expenseIndex: number; authorIndex?: number }) => void;
  onDuplicateExpense: (payload: { expenseIndex: number; authorIndex?: number }) => void;
  onRemoveExpense: (payload: { expenseIndex: number; authorIndex?: number }) => void;
  setFee: (payload: { fee: any; feeIndex: number; authorIndex?: number }) => void;
  onDuplicateFee: (payload: { feeIndex: number; authorIndex?: number }) => void;
  onRemoveFee: (payload: { feeIndex: number; authorIndex?: number }) => void;
  onRegisterExpense: () => void;
  onRegisterFee: () => void;
  installmentVisible: boolean;
  expenseVisible: boolean;
  feeVisible: boolean;
  art523Enabled: boolean;
  toggleInstallment: (payload?: boolean) => void;
  toggleExpense: (payload?: boolean) => void;
  toggleFee: (payload?: boolean) => void;
  handleArt523Toggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  installmentTotal: number;
  expenseTotal: number;
  feeTotal: number;
  art523Total: number;
}
