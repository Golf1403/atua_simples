import MonetaryRegisterImp from './MonetaryRegisterImp';
import MonetaryFineImp from './MonetaryFineImp';
import MonetaryFine523Imp from './MonetaryFine523Imp';

export interface ExpenseFineImp extends MonetaryFineImp {
  expenseId?: number;
}

export default interface ExpenseImp extends MonetaryRegisterImp {
  article_523: boolean;
  fine523?: MonetaryFine523Imp;
  date: string;
}
