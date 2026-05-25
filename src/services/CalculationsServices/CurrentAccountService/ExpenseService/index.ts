import _ from 'lodash';
import moment, { Moment } from 'moment';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentOccurrenceImp, { CurrentExpenseImp } from '@interfaces/calculations/CurrentOccurrenceImp';
import { initialInstallmentOccurrence, typeExpenseSection } from '@/hooks/interfaces/CurrentAccountHookImp';
import ViewOccorrenceImp from '@interfaces/calculations/ViewOccorrenceImp';
import { CurrentTypes } from '@/data/calculations/currentTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { getCoin } from '@/utils/numberUtils';

export interface CalculateImp {
  expense: CurrentExpenseImp;
  views: ViewOccorrenceImp[];
  balance: number;
  type: CurrentTypes;
}
export interface CreateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  updateTo: string;
}

export type CreateResponseImp = CurrentAuthorImp[];

export interface DeleteImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  expenseIndex: number;
}

export type DeleteResponseImp = CurrentAuthorImp[];

export interface UpdateImp {}

export interface DuplicateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  expenseIndex: number;
}

export type DuplicateResponseImp = CurrentAuthorImp[];

export interface UpdateResponseImp {}

export default class ExpenseService {
  protected balance = 0;
  protected interestTotal = 0;
  protected defaultTotal = 0;
  protected compensatoryTotal = 0;
  protected compoundTotal = 0;
  protected views: ViewOccorrenceImp[] = [];

  private dateCompare(
    param1: CurrentOccurrenceImp | CurrentExpenseImp,
    param2: CurrentOccurrenceImp | CurrentExpenseImp
  ) {
    const dateA = moment(param1.date, dateFormatEnum.DEFAULT);
    const dateB = moment(param2.date, dateFormatEnum.DEFAULT);

    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  }

  public async calculate({ expense, balance, views }: CalculateImp) {
    console.info('calculate_expense');

    this.views = views;
    this.balance = balance;

    const occurrenceValue = expense.value || 0;

    expense.newestOccurrence = false;

    this.balance += occurrenceValue;

    const currency = getCoin(expense.date as string, 0);

    const payloadView: ViewOccorrenceImp = {
      updateSince: null,
      balance: this.balance,
      date: expense.date,
      currency,
      description: expense.description,
      tax: expense.tax,
      type: expense.type,
      interestBalance: 0,
      value: occurrenceValue,
      fineBalance: 0,
      total: this.balance,
    };

    this.views.push(payloadView);
    return { views: this.views, balanceTotal: this.balance };
  }

  public order(param: CurrentExpenseImp[]): CurrentExpenseImp[] {
    console.info('order_expense');
    return param.sort(this.dateCompare);
  }

  public duplicate({ authorList, authorIndex, expenseIndex }: DuplicateImp): DuplicateResponseImp {
    console.info('duplicate_expense');
    const newAuthorList = _.cloneDeep(authorList);
    const expenses = newAuthorList[authorIndex].expenses;
    const occurrence: CurrentExpenseImp = expenses[expenseIndex];

    this.cleanOccurrenceActive(expenses);

    const newOccurrence: CurrentExpenseImp = _.assign(
      {},
      _.cloneDeep({
        ...occurrence,
        newestOccurrence: true,
        date: moment(occurrence.date, dateFormatEnum.DEFAULT).add(1, 'M').format(dateFormatEnum.DEFAULT),
      })
    ) as CurrentExpenseImp;

    newAuthorList[authorIndex].expenses.push(newOccurrence);
    newAuthorList[authorIndex].occurrenceTotal = 0;

    return newAuthorList;
  }

  public create({ authorList, authorIndex, updateTo }: CreateImp): CreateResponseImp {
    console.info('create_expense');
    const newAuthorList = _.cloneDeep(authorList);
    if (!newAuthorList[authorIndex].expenses) newAuthorList[authorIndex].expenses = [];
    const expenses: CurrentExpenseImp[] = newAuthorList[authorIndex].expenses;

    this.cleanOccurrenceActive(expenses);

    const newOccurrence = _.cloneDeep({
      ...initialInstallmentOccurrence,
      date: updateTo,
      type: typeExpenseSection.id,
      newestOccurrence: true,
    }) as CurrentExpenseImp;

    expenses.unshift(newOccurrence);
    newAuthorList[authorIndex].occurrenceTotal = 0;

    if (!newAuthorList[authorIndex].smallerDate)
      newAuthorList[authorIndex].smallerDate = newOccurrence.date || undefined;

    return newAuthorList;
  }

  public cleanOccurrenceActive(expenses: CurrentExpenseImp[]) {
    const filteredOccurrences = expenses.filter(occurrence => occurrence.newestOccurrence);

    filteredOccurrences.forEach(occurrence => {
      occurrence.newestOccurrence = false;
    });
  }

  public delete({ authorList, authorIndex, expenseIndex }: DeleteImp): DeleteResponseImp {
    console.info('delete_expense');
    const newAuthorList = _.cloneDeep(authorList);
    const expenses = newAuthorList[authorIndex].expenses;
    this.cleanOccurrenceActive(expenses);

    expenses.splice(expenseIndex, 1);
    newAuthorList[authorIndex].occurrenceTotal = 0;
    if (!expenses.length) newAuthorList[authorIndex].smallerDate = undefined;
    return newAuthorList;
  }
}
