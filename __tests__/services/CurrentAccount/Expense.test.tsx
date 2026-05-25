import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import { initialExpenseOccurrence } from '@/hooks/interfaces/CurrentAccountHookImp';
import { CurrentExpenseImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import { initialCurrentAuthor } from '@/hooks/currentAccount';
import ExpenseService from '@/services/CalculationsServices/CurrentAccountService/ExpenseService';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import moment from 'moment';

const expenseService = new ExpenseService();

describe('Expenses CRUD', () => {
  const expense: CurrentExpenseImp = {
    ...initialExpenseOccurrence,
    date: '01/01/2000',
    value: 10000,
  };

  const expenses: CurrentExpenseImp[] = [expense];

  const current: CurrentAuthorImp = {
    ...initialCurrentAuthor,
    expenses: expenses,
  };

  const list: CurrentAuthorImp[] = [current];

  test('create expense correctly ', async () => {
    const [author] = expenseService.create({ authorList: list, authorIndex: 0, updateTo: '01/01/2021' });
    expect(author.expenses.length).toBe(2);
  });
  test('delete expense correctly ', async () => {
    expect(list[0].expenses.length).toBe(1);
    const [author] = expenseService.delete({ authorList: list, authorIndex: 0, expenseIndex: 0 });
    expect(author.expenses.length).toBe(0);
  });
  test('duplicate expense correctly ', async () => {
    expect(list[0].expenses.length).toBe(1);
    const [author] = expenseService.duplicate({ authorList: list, authorIndex: 0, expenseIndex: 0 });
    expect(author.expenses.length).toBe(2);
    const [expense1, expense2] = author.expenses;
    expect(expense1).toStrictEqual(expense);
    expect(expense1).not.toHaveProperty('newestOccurrence');
    expect(expense2).toHaveProperty('newestOccurrence');
    expect(expense2).toStrictEqual({
      ...expense1,
      date: moment(expense1.date, dateFormatEnum.DEFAULT).add(1, 'month').format(dateFormatEnum.DEFAULT),
      newestOccurrence: true,
    });
  });
});
