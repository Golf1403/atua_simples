import AccountImp from './AccountImp';
import ExpenseImp from './calculations/ExpenseImp';
import FeeImp from './calculations/FeeImp';
import MonetaryFine523Imp from './calculations/MonetaryFine523Imp';
import CurrentAuthorImp from './calculations/CurrentAuthorImp';
import SimpleAuthorImp from './calculations/SimpleAuthorImp';
import { FeeFinesImp } from '@/hooks/currentAccount';
import { CurrentTypes } from '@/data/calculations/currentTypes';

export interface SimpleAccountImp {
  account: AccountImp;
  authors: SimpleAuthorImp[];
  installmentsTotal: number;
  paymentsTotal: number;
  expensesTotal: number;
  feesTotal: number;
  total: number;
  isCheckedArt523?: boolean;
  art523?: MonetaryFine523Imp;
  fees?: FeeImp[];
  expenses?: ExpenseImp[];
  installmentsFinesTotal?: number;
  installmentsInterestTotal?: number;
  calculationMemories?: string[];
  currency?: string;
}

export interface CurrentAccoutImp {
  account: AccountImp;
  authors: CurrentAuthorImp[];
  feeFines?: FeeFinesImp;
  type: CurrentTypes;
}
