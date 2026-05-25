import Base from './Base';
import ExpenseImp from '@/interfaces/calculations/ExpenseImp';

export default interface UpdateImp extends Base {
  expense: ExpenseImp;
  expenseIndex: number;
}
