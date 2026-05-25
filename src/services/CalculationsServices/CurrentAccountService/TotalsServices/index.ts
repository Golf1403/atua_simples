import { dateFormatEnum } from '@/enums/DateFormatEnum';
import {
  typeCorrection,
  typeExpense,
  typeExpenseSection,
  typeFee,
  typeFine,
  typeinstallment,
  typeInterest,
  typeInterestCorrection,
  typePayment,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentAuthorImp from '@/interfaces/calculations/CurrentAuthorImp';
import ViewOccorrenceImp, { ViewType } from '@/interfaces/calculations/ViewOccorrenceImp';
import { valueWithCurrency } from '@/lib/currency';
import { translateInterest } from '@/utils/interestCivilCodeHelper';
import { getCoin } from '@/utils/numberUtils';
import moment from 'moment';

export interface AccountTotalsImp {
  total: string;
  type: string;
  from: string;
  year: string;
  aroundYear: string;
}
export interface AuthorsTotalImp {
  total?: string;
  title: string;
}

export default class TotalsService {
  protected views: ViewOccorrenceImp[] = [];
  protected authors: CurrentAuthorImp[] = [];
  protected currency: string = 'R$';

  constructor({
    authors,
    views,
    updateTo,
  }: {
    views?: ViewOccorrenceImp[];
    authors?: CurrentAuthorImp[];
    updateTo?: string;
  }) {
    if (views) this.views = views;
    if (authors) this.authors = authors;
    const currency = getCoin(updateTo || moment(new Date()).format(dateFormatEnum.DEFAULT), 0);
    this.currency = currency;
  }

  public run({ isFullAccount, isFullAuthors }: { isFullAccount?: boolean; isFullAuthors?: boolean }) {
    if (isFullAccount) return this.calculateAccountTotal();
    if (isFullAuthors) return this.calculateAuthorsTotal();
  }

  private getOccurrenceValue(occurrence: any) {
    return occurrence.correctedValue || occurrence.total || occurrence.value || 0;
  }

  private getInterestValue(occurrence: any) {
    return (occurrence.interests || []).reduce((sum: number, interest: any) => sum + (interest.calculated || 0), 0);
  }

  private getFineValue(occurrence: any) {
    return (occurrence.fines || []).reduce((sum: number, fine: any) => sum + (fine.calculated || 0), 0);
  }

  private calculateAuthorTotal(author: CurrentAuthorImp) {
    const occurrences = author.occurrences || [];
    const expenses = author.expenses || [];
    const fees = author.fees || [];
    const installments = occurrences.filter((occurrence: any) => occurrence.type === typeinstallment.id);
    const payments = occurrences.filter((occurrence: any) => occurrence.type === typePayment.id);
    const installmentTotal = installments.reduce(
      (sum: number, occurrence: any) => sum + this.getOccurrenceValue(occurrence),
      0
    );
    const installmentInterestTotal = installments.reduce(
      (sum: number, occurrence: any) => sum + this.getInterestValue(occurrence),
      0
    );
    const installmentFineTotal = installments.reduce(
      (sum: number, occurrence: any) => sum + this.getFineValue(occurrence),
      0
    );
    const paymentTotal = payments.reduce(
      (sum: number, occurrence: any) => sum + this.getOccurrenceValue(occurrence),
      0
    );
    const paymentInterestTotal = payments.reduce(
      (sum: number, occurrence: any) => sum + this.getInterestValue(occurrence),
      0
    );
    const expenseTotal = expenses.reduce(
      (sum: number, expense: any) => sum + (expense.correctedValue || expense.total || expense.value || 0),
      0
    );
    const feeTotal = fees.reduce(
      (sum: number, fee: any) => sum + (fee.correctedValue || fee.total || fee.calculated || fee.value || 0),
      0
    );

    return (
      installmentTotal +
      installmentInterestTotal +
      installmentFineTotal -
      paymentTotal -
      paymentInterestTotal +
      expenseTotal +
      feeTotal
    );
  }

  private calculateAuthorsTotal() {
    const descriptions: AuthorsTotalImp[] = [];
    let total = 0;
    descriptions.push({ title: `Este cálculo possui ${this.authors.length} autores` });

    for (const key in this.authors) {
      const currentAuthor = this.authors[key];
      const subTotal = this.calculateAuthorTotal(currentAuthor);
      total += subTotal;
      descriptions.push({
        total: valueWithCurrency(this.currency, subTotal),
        title: currentAuthor.name,
      });
    }

    descriptions.push({ total: valueWithCurrency(this.currency, total), title: 'Total' });

    return descriptions;
  }

  private translateType(type: ViewType) {
    switch (type) {
      case typeinstallment.id:
        return typeinstallment.label;
      case typePayment.id:
        return typePayment.label;
      case typeExpense.id:
        return typeExpense.label;
      case typeFee.id:
        return typeFee.label;
      case typeCorrection.id:
        return typeCorrection.label;
      case typeFine.id:
        return typeFine.label;
      case typeInterestCorrection.id:
        return typeInterestCorrection.label;
      case typeExpenseSection.id:
        return typeExpenseSection.label;
      default:
        return type;
    }
  }

  private calculateAccountTotal() {
    const occurrenceTypes: ViewType[] = [
      typeinstallment.id,
      typePayment.id,
      typeExpense.id,
      typeFee.id,
      typeExpenseSection.id,
    ];

    const obj: { [key: string]: any } = {};
    let totalAroundYears = 0;
    let totalYears = 0;

    for (let index = 0; index < this.views.length; index++) {
      const view = this.views[index];
      for (const key in occurrenceTypes) {
        const type = occurrenceTypes[key];
        if (
          (view.type.includes(typeCorrection.id) ||
            view.type.includes(typeInterest.id) ||
            view.type.includes(typeFine.id)) &&
          view.correctedFrom?.includes(type)
        ) {
          const dateStart = moment(view.date, dateFormatEnum.DEFAULT);
          const dateEnd = moment(view.dateEnd, dateFormatEnum.DEFAULT);
          const diffMonth = dateEnd.diff(dateStart, 'month');
          const year = Number((diffMonth / 12).toFixed(2));
          const yearAcc = (obj[type]?.year || 0) + year;
          const aroundYear = Math.ceil(yearAcc);

          obj[`${view.type}_${type}`] = {
            total: (obj[view.type]?.total || 0) + 1,
            type: view.type == typeInterest.id ? translateInterest(view, []) : this.translateType(view.type),
            from: this.translateType(type),
            year: yearAcc,
            aroundYear,
          };
        }
      }
    }

    const descriptions: AccountTotalsImp[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        totalAroundYears += element.aroundYear;
        totalYears += element.year;
        element.aroundYear &&
          descriptions.push({
            total: `${element.total}`,
            type: element.type,
            from: `${element.from}:`,
            year: String(element.year.toFixed(2)).replace('.', ','),
            aroundYear: `(${element.aroundYear}) anos.`,
          });
      }
    }
    descriptions.push({
      total: '',
      type: '',
      from: '',
      year: String(totalYears.toFixed(2)).replace('.', ','),
      aroundYear: `(${totalAroundYears}) anos.`,
    });
    return descriptions;
  }
}
