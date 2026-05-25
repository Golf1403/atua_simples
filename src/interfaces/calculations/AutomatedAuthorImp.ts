import PaymentImp from './PaymentImp';
import ExpenseImp from './ExpenseImp';
import FeeImp from './FeeImp';
import MonetaryFine523Imp from './MonetaryFine523Imp';
import MonetaryInterestImp from './MonetaryInterestImp';

export default interface AutomatedAuthorImp {
  id: string;
  name: string;
  automatedInstallments?: any[];
  payments: PaymentImp[];
  expenses: ExpenseImp[];
  fees: FeeImp[];
  fine523?: MonetaryFine523Imp;
  total: number;
  installmentsTotal: number;
  paymentsTotal: number;
  expensesTotal: number;
  feesTotal: number;
  interests: MonetaryInterestImp[];
  interestsTotal: number;
  calculationsMemory: string[];
}
