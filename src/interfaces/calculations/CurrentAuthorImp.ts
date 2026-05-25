import CurrentFeeAndFineImp from './CurrentFeeAndFineImp';
import CurrentInterestFineFeeType from './CurrentInterestFineImp';
import CurrentOccurrenceImp, { CurrentExpenseImp, CurrentFeeOccorrenceImp } from './CurrentOccurrenceImp';
import ViewOccorrenceImp from './ViewOccorrenceImp';

export default interface CurrentAuthorImp {
  name: string;
  smallerDate?: string;
  occurrences: CurrentOccurrenceImp[];
  interestFines: CurrentInterestFineFeeType[];
  expenses: CurrentExpenseImp[];
  fees?: CurrentFeeOccorrenceImp[];
  view: ViewOccorrenceImp[];
  occurrenceTotal: number;
  expenseTotal: number;
}
