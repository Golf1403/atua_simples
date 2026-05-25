import _ from 'lodash';
import { typeAccountCurrent } from '@/data/calculations/currentTypes';
import MemCalcImp from '@interfaces/MemCalcImp';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentOccurrenceImp, { CurrentExpenseImp } from '@interfaces/calculations/CurrentOccurrenceImp';
import ViewOccorrenceImp, { SummaryImp } from '@interfaces/calculations/ViewOccorrenceImp';
import moment from 'moment';
import { getCoin, roundNumber } from '../../../../utils/numberUtils';
import InterestsFineService from '../InterestsFineService';
import OccurrenceService from '../OccurrenceService';
import { interestEnum } from '@/enums/InterestEnum';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import {
  CurrentState,
  typeAuthors,
  typeCorrection,
  typeExpenseTitle,
  typeInterest,
  typePayment,
  typeFee,
  typeTotal,
  typeinstallment,
  typeExpense,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import ExpenseService from '../ExpenseService';
import CurrentMonetaryCorrectionService, { ApplyMonetaryCorrectionToBalanceImp } from '../MonetaryCorrection';
import { doConversion } from '@/utils/conversionHelper';
import { valueWithCurrency } from '@/lib/currency';
import { getIndexComposition } from '@/components/DefaultTooltip';
import { AdministrativeNatureCorrectionImp } from '@/interfaces/calculations/MonetaryCorrectionParamsImp';
import { getSelicEndDate, getSelicStartDate } from '@/utils/getWithoutSelicRange';
import { CurrentInterestRestImp } from '@/interfaces/calculations/CurrentInterestFineImp';
import FeeFineService from '../FeeFineService';
import { typeArt354 } from '@/hooks/currentAccount';
import { typeAdministrativeNature, typeSelectIndex } from '@/data/calculations/civilCodeTypes';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import LawImp from '@/interfaces/Law';
import { getFieldName } from '@/lib/nomenclature';
import INomenclature from '@/interfaces/NomenclatureImp';
import { labelsEnum } from '@/enums/labelsEnum';

export type AllMemcalcsImp = {
  [key: number]: MemCalcImp[];
};

export type CalculateImp = Omit<CurrentState, 'layout'> & {
  isTest?: boolean;
  updateTo?: string;
  changeUpdateTo?: boolean;
  lastUpdateTo?: string;
  changeInstallmentDate?: boolean;
  lastInstallmentDate?: string;
  occurrenceDate?: string;
  authorIndex: number;
  allMemcalcs: AllMemcalcsImp;
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp;
  interestIndexesFromLaw: LawImp[];
  nomenclatures: INomenclature[];
};

export const calcPercentage = (balanceTotal: number, correctionValue: number) => {
  const balanceDiff = balanceTotal - correctionValue;

  const percentageDivision = balanceTotal / (balanceDiff || 1) - 1;
  const calcWithoutSymbol = percentageDivision == -1 ? 0 : percentageDivision * 100;
  const calcWithPercentageSymbol = String(calcWithoutSymbol.toFixed(4) + '%');

  return calcWithPercentageSymbol;
};

export default class CurrentAccountService {
  protected views: ViewOccorrenceImp[] = [];
  protected fineTotal = 0;
  protected interestTotal = 0;
  protected balanceTotal = 0;
  protected expenseTotal = 0;
  protected smallerDate = moment();
  protected total = 0;
  private occurrenceService = new OccurrenceService();
  private expenseService = new ExpenseService();
  private interestsService = new InterestsFineService();
  private currentMonetaryCorrectionService = new CurrentMonetaryCorrectionService();

  public async detailMonetaryCorrection(param: ApplyMonetaryCorrectionToBalanceImp) {
    const {
      dates: { currentDate, nextDate },
      isExpense,
    } = param;
    if (currentDate.isBefore(this.smallerDate)) this.smallerDate = currentDate;

    const { currency, correctionValue, balanceTotal, details } = await this.currentMonetaryCorrectionService.calculate(
      param
    );

    const date = currentDate.format(dateFormatEnum.DEFAULT);
    const dateEnd = nextDate.format(dateFormatEnum.DEFAULT);

    const percentage = calcPercentage(balanceTotal, correctionValue);
    if (isExpense) this.expenseTotal += correctionValue;

    const lastView = this.views[this.views.length - 1];

    const currentCurrency = getCoin(date, 0);
    const endCurrency = getCoin(dateEnd, 0);

    const value = valueWithCurrency(currentCurrency, param.balance);
    const result = valueWithCurrency(endCurrency, correctionValue);
    const lastBalance = valueWithCurrency(lastView.currencyBalance || lastView.currency, lastView.balance);
    const balanceResult = valueWithCurrency(endCurrency, balanceTotal);

    const payloadView: ViewOccorrenceImp = {
      updateSince: null,
      balance: isExpense ? this.expenseTotal : roundNumber(balanceTotal),
      date,
      description: `(${percentage} sobre ${value} = ${result} que somado ao principal anterior ${lastBalance} = ${balanceResult})`,
      tax: null,
      currency,
      interestBalance: doConversion(
        isExpense ? 0 : roundNumber(this.interestTotal),
        date,
        dateEnd || param.account.updateTo
      ),
      fineBalance: doConversion(isExpense ? 0 : roundNumber(this.fineTotal), date, dateEnd || param.account.updateTo),
      type: typeCorrection.id,
      correctedFrom: param.correctedFrom,
      value: correctionValue,
      total: isExpense ? this.expenseTotal : balanceTotal + this.interestTotal + this.fineTotal,
      dateEnd,
      details,
    };

    const currentOccurrenceFormat = currentDate.format('MM/YYYY');
    const nextOccurrenceFormat = nextDate.format('MM/YYYY');

    const shoudBeViewer = param.account.proRataDay && nextDate.isAfter(currentDate);

    if (currentOccurrenceFormat != nextOccurrenceFormat || shoudBeViewer)
      payloadView.value && this.views.push(payloadView);

    return {
      balanceTotal: roundNumber(balanceTotal),
      correctionValue,
    };
  }

  private getMemCalcComposition(memCalcs: MemCalcImp[]) {
    const newMemCalc: string[] = [];
    memCalcs.forEach(memCalc => {
      newMemCalc.push(getIndexComposition(memCalc));
    });

    return newMemCalc;
  }

  async calculate({
    account: { current, infos },
    changeUpdateTo = false,
    lastUpdateTo,
    updateTo,
    changeInstallmentDate = false,
    lastInstallmentDate,
    occurrenceDate,
    authorIndex,
    allMemcalcs,
    feeFines = { list: [], total: 0 },
    isTest,
    memCalcs,
    interestIndexes,
    interestIndexesFromLaw,
    nomenclatures,
    author,
    account,
  }: CalculateImp) {
    console.info('calculate-current-account_service');
    const views: ViewOccorrenceImp[] = [];
    const summary: SummaryImp[] = [];
    const authorList: CurrentAuthorImp[] = Object.assign(author.list, []);
    let occurrences: CurrentOccurrenceImp[] = [];
    let expenses: CurrentExpenseImp[] = [];
    let feeFinesTotal = 0;

    try {
      const interestsFineService = new InterestsFineService();

      let total = 0;
      for (let index = 0; index < authorList.length; index++) {
        this.balanceTotal = 0;
        this.interestTotal = 0;
        this.fineTotal = 0;
        this.expenseTotal = 0;

        const currentAuthor = authorList[index];
        currentAuthor.interestFines = this.interestsService.definePriorities(currentAuthor.interestFines);
        const { occurrences: occurrenceParam, interestFines, expenses: expensesParam } = currentAuthor;

        views.push({
          balance: 0,
          currency: '',
          date: '',
          description: currentAuthor.name.length ? currentAuthor.name : `Autor ${index + 1}`,
          interestBalance: 0,
          tax: 0,
          type: typeAuthors.id,
          updateSince: '',
          value: 0,
          total: 0,
          fineBalance: 0,
        });

        summary.push({
          desc: currentAuthor.name.length ? currentAuthor.name : `Autor ${index + 1}`,
          from: typeAuthors.id,
        });

        if (changeUpdateTo && lastUpdateTo)
          occurrences = this.occurrenceService.changeUpdateTo(occurrenceParam, lastUpdateTo, current.updateTo);

        occurrences = this.occurrenceService.order(occurrenceParam) as CurrentOccurrenceImp[];
        if (expensesParam) expenses = this.expenseService.order(expensesParam) as CurrentExpenseImp[];

        let interestFineApplyByDate: Map<string, Array<string>> = new Map();
        let correctionFromOccurrence = 0;

        for (let occurrenceIndex = 0; occurrenceIndex < occurrences.length; occurrenceIndex++) {
          const currentOccurrence = occurrences[occurrenceIndex];
          const nextOccurrence = occurrences?.[occurrenceIndex + 1];

          const occurrenceIsPayment = currentOccurrence.type == typePayment.id;
          const occurrenceIsInstallment = currentOccurrence.type == typeinstallment.id;
          const isBeforeCorrection = occurrenceIsPayment ? currentOccurrence.isBeforeCorrection : false;
          const isWithCorrection = occurrenceIsInstallment ? !currentOccurrence.isWithoutCorrection : true;
          const shoudBeCorrectedBeforeFromCalc = occurrenceIsPayment && isBeforeCorrection;

          const currentOccurrenceDate = moment(currentOccurrence.date, dateFormatEnum.DEFAULT);
          let nextOccurrenceDate = moment(nextOccurrence?.date || current.updateTo, dateFormatEnum.DEFAULT);
          const updateToDate = moment(current.updateTo, dateFormatEnum.DEFAULT);

          if (nextOccurrenceDate.isAfter(updateToDate)) nextOccurrenceDate = updateToDate;
          if (currentOccurrenceDate.isAfter(updateToDate)) nextOccurrenceDate = updateToDate;

          const getInfo = (occurrence: CurrentOccurrenceImp) => {
            switch (occurrence.type) {
              case typePayment.id:
                return getFieldName(
                  occurrence.description?.length
                    ? occurrence.description
                    : `${typePayment.label} ${occurrenceIndex + 1}`,
                  nomenclatures
                );
              case typeinstallment.id:
                return getFieldName(
                  occurrence.description?.length
                    ? occurrence.description.trim()
                    : `${typeinstallment.label} ${occurrenceIndex + 1}`,
                  nomenclatures
                );
              case typeFee.id:
                return getFieldName(
                  occurrence.description?.length ? occurrence.description : `${typeFee.label} ${occurrenceIndex + 1}`,
                  nomenclatures
                );
              case typeExpense.id:
                return getFieldName(
                  occurrence.description?.length ? occurrence.description : `${typeFee.label} ${occurrenceIndex + 1}`,
                  nomenclatures
                );
              default:
                return occurrence.description?.length ? occurrence.description : ``;
            }
          };

          summary.push({
            desc: getInfo(currentOccurrence),
            from: currentOccurrence.type,
          });

          const filtersInterstsAndFines = this.interestsService.order(
            interestFines,
            currentOccurrenceDate,
            nextOccurrenceDate,
            changeUpdateTo,
            lastUpdateTo,
            updateTo,
            occurrenceIsInstallment,
            changeInstallmentDate && authorIndex == index,
            lastInstallmentDate,
            occurrenceDate,
            current.proRataDay
          );

          const administrativeNatureCorrection = filtersInterstsAndFines.map(interestFine => {
            const onlyInterest = interestFine.type == typeInterest.id;
            const onlyNatAdmOrSelectIndex =
              onlyInterest &&
              (interestFine.civilCode?.includes(typeAdministrativeNature.id) ||
                interestFine.civilCode?.includes(typeSelectIndex.id));
            const isWithoutCorrection =
              onlyInterest && onlyNatAdmOrSelectIndex ? interestFine.onInterestWithoutCorrection : false;

            return {
              isWithoutCorrection: isWithoutCorrection,
              selicEndDate: getSelicEndDate(interestFine as CurrentInterestRestImp, current.proRataDay),
              selicStartDate: getSelicStartDate(interestFine as CurrentInterestRestImp, current.proRataDay),
            } as AdministrativeNatureCorrectionImp;
          });

          if (shoudBeCorrectedBeforeFromCalc) {
            if (isWithCorrection) {
              const { balanceTotal, correctionValue } = await this.detailMonetaryCorrection({
                balance: this.balanceTotal,
                account: current,
                dates: {
                  currentDate: currentOccurrenceDate,
                  nextDate: nextOccurrence ? nextOccurrenceDate : updateToDate,
                },
                administrativeNatureCorrection,
                isTest,
                correctedFrom: currentOccurrence.type,
                memCalcs,
              });
              correctionFromOccurrence = correctionValue;
              this.balanceTotal = balanceTotal;
              const nextDate = !current.proRataDay ? updateToDate.add(1, 'month') : updateToDate;
              const diffMonth = nextDate.diff(currentOccurrenceDate, 'month');
              const year = Number((diffMonth / 12).toFixed(2));

              summary.push({
                date: nextDate.format(dateFormatEnum.DEFAULT),
                desc: typeCorrection.label,
                year,
              });
            }

            const occurrenceResponse = await this.occurrenceService.calculate({
              account,
              balance: this.balanceTotal,
              interestTotal: this.interestTotal,
              fineTotal: this.fineTotal,
              occurrencesLength: occurrences.length,
              occurrence: { current: currentOccurrence, next: nextOccurrence },
              occurrenceIndex,
              views,
              type: infos.type,
              isTest,
              memCalcs,
              allMemcalcs,
              interestIndexes,
              nomenclatures,
              author,
              feeFines,
              interestIndexesFromLaw,
              authorIndex,
            });

            this.balanceTotal = occurrenceResponse.balanceTotal;
            this.views = occurrenceResponse.views;
            this.interestTotal = occurrenceResponse.interestTotal;
          } else {
            const occurrenceResponse = await this.occurrenceService.calculate({
              account,
              balance: this.balanceTotal,
              interestTotal: this.interestTotal,
              fineTotal: this.fineTotal,
              occurrencesLength: occurrences.length,
              occurrence: { current: currentOccurrence, next: nextOccurrence },
              occurrenceIndex,
              views,
              type: infos.type,
              isTest,
              memCalcs,
              allMemcalcs,
              interestIndexes,
              nomenclatures,
              author,
              feeFines,
              interestIndexesFromLaw,
              authorIndex,
            });

            this.balanceTotal = occurrenceResponse.balanceTotal;
            this.views = occurrenceResponse.views;
            this.interestTotal = occurrenceResponse.interestTotal;

            const currentDate = currentOccurrenceDate.unix();
            const limitDate = updateToDate.unix();

            if (isWithCorrection && limitDate >= currentDate) {
              const { balanceTotal, correctionValue } = await this.detailMonetaryCorrection({
                account: current,
                balance: this.balanceTotal,
                dates: {
                  currentDate: currentOccurrenceDate,
                  nextDate: nextOccurrence ? nextOccurrenceDate : updateToDate,
                },
                administrativeNatureCorrection,
                correctedFrom: currentOccurrence.type,
                memCalcs,
                isTest,
              });

              const nextDate = !current.proRataDay ? updateToDate.add(1, 'month') : updateToDate;

              const diffMonth = nextDate.diff(currentOccurrenceDate, 'month');
              const year = Number((diffMonth / 12).toFixed(2));

              summary.push({
                date: nextDate.format(dateFormatEnum.DEFAULT),
                desc: typeCorrection.label,
                from: typeCorrection.id,
                year,
              });

              correctionFromOccurrence = correctionValue;
              this.balanceTotal = balanceTotal;
            }
          }

          const interestsFineResponse = await interestsFineService.calculate({
            account: current,
            balance: this.balanceTotal,
            interestTotal: this.interestTotal,
            interestFineApplyByDate,
            interestFineList: filtersInterstsAndFines,
            summary,
            occurrence: {
              currentDate: currentOccurrenceDate,
              value: currentOccurrence.value,
              nextDate: nextOccurrenceDate,
              type: currentOccurrence.type,
            },
            type: infos.type,
            views,
            isFirstOccurrence: occurrenceIndex == 0,
            isLastOccurrence: occurrenceIndex == occurrences.length - 1,
            correctionFromOccurrence,
            isTest,
            allMemcalcs,
            memCalcs,
            interestIndexes,
            interestIndexesFromLaw,
            nomenclatures,
          });

          this.fineTotal = interestsFineResponse.fineTotal;
          this.balanceTotal = interestsFineResponse.balanceTotal;
          this.views = interestsFineResponse.views;
          this.interestTotal = interestsFineResponse.interestTotal;
          interestFineApplyByDate = interestsFineResponse.interestFineApplyByDate;
        }

        if (expenses.length) {
          const expenseTitle: ViewOccorrenceImp = {
            updateSince: null,
            balance: 0,
            date: '',
            currency: '',
            description: '',
            fineBalance: this.fineTotal,
            tax: null,
            type: typeExpenseTitle.id,
            interestBalance: this.interestTotal,
            value: 0,
            total: 0,
          };

          views.push(expenseTitle);
        }

        for (let expenseIndex = 0; expenseIndex < expenses.length; expenseIndex++) {
          const currentExpense = expenses[expenseIndex];
          const nextExpense = expenses?.[expenseIndex + 1];

          const currentExpenseDate = moment(currentExpense.date, dateFormatEnum.DEFAULT);
          let nextExpenseDate = moment(nextExpense?.date || current.updateTo, dateFormatEnum.DEFAULT);
          const updateToDate = moment(current.updateTo, dateFormatEnum.DEFAULT);

          if (nextExpenseDate.isAfter(updateToDate)) nextExpenseDate = updateToDate;
          if (currentExpenseDate.isAfter(updateToDate)) nextExpenseDate = updateToDate;

          const expenseResponse = await this.expenseService.calculate({
            balance: this.expenseTotal,
            expense: currentExpense,
            views,
            type: infos.type,
          });

          this.views = expenseResponse.views;
          this.expenseTotal = expenseResponse.balanceTotal;

          this.expenseTotal = doConversion(
            this.expenseTotal,
            currentExpenseDate.format(dateFormatEnum.DEFAULT),
            nextExpenseDate.format(dateFormatEnum.DEFAULT)
          );

          await this.detailMonetaryCorrection({
            account: current,
            balance: currentExpense.value,
            isExpense: true,
            correctedFrom: currentExpense.type,
            dates: { currentDate: currentExpenseDate, nextDate: updateToDate },
            isTest,
            memCalcs,
          });
        }

        if (infos.type !== typeAccountCurrent.id) {
          this.balanceTotal += this.interestTotal;
          this.balanceTotal += this.fineTotal;
        }

        const payloadView: ViewOccorrenceImp = {
          updateSince: null,
          balance: roundNumber(this.balanceTotal + this.expenseTotal),
          date: current.updateTo,
          description: `${
            infos.type == typeArt354.id
              ? `${getFieldName(labelsEnum.TOTAL, nomenclatures)} ${
                  authorList[index].name
                } (Soma do principal com o saldo dos ${getFieldName(labelsEnum.INTEREST, nomenclatures)})`
              : getFieldName(labelsEnum.TOTAL, nomenclatures)
          }`,
          currency: getCoin(current.updateTo, 0),
          tax: null,
          interestBalance: this.interestTotal,
          fineBalance: this.fineTotal,
          type: typeTotal.id,
          value: interestEnum.INTEREST_TOTAL,
          total: roundNumber(this.balanceTotal + this.expenseTotal),
        };

        total += payloadView.balance;

        this.views.push(payloadView);

        authorList[index].smallerDate = (occurrences.length && occurrences[0].date) || undefined;
        authorList[index].occurrences = occurrences;
        authorList[index].interestFines = interestFines;
        authorList[index].occurrenceTotal = roundNumber(this.balanceTotal);
        authorList[index].expenseTotal = roundNumber(this.expenseTotal);
      }

      const memCalcsFiltered = memCalcs.filter(calc => {
        const initialDate = moment(calc.mecstarta);
        const endDate = moment(calc.mecenda || new Date());

        return (
          initialDate.isBetween(this.smallerDate, moment(current.updateTo, dateFormatEnum.DEFAULT), null, '[]') ||
          endDate.isBetween(this.smallerDate, moment(current.updateTo, dateFormatEnum.DEFAULT), null, '[]') ||
          this.smallerDate.isBetween(initialDate, endDate, null, '[]') ||
          moment(current.updateTo, dateFormatEnum.DEFAULT).isBetween(initialDate, endDate, null, '[]')
        );
      });

      const memCalcsMapped = memCalcsFiltered.map((calc): MemCalcImp => {
        let initialDate = moment(calc.mecstarta);
        if (this.smallerDate.isAfter(initialDate)) initialDate = this.smallerDate;

        return { ...calc, mecstarta: initialDate.format(dateFormatEnum.AMERICAN_DATE) };
      });

      const memCalcComposition = this.getMemCalcComposition(memCalcsMapped);
      memCalcComposition.unshift(',');

      const feeFineService = new FeeFineService();

      const beforeFeeFines = feeFineService.orderByDate({
        feeFines: feeFines?.list?.filter(feeFine => !feeFine.afterTotal),
      });
      const afterFeeFines = feeFineService.orderByDate({
        feeFines: feeFines?.list?.filter(feeFine => !!feeFine.afterTotal),
      });

      current.onePercentSelic && memCalcComposition.push('Acréscimo de 1% no último mês');

      const calculationsMemory = memCalcComposition.join().replaceAll(',', '\n\t');

      const totalView: ViewOccorrenceImp = {
        updateSince: null,
        balance: roundNumber(total),
        date: current.updateTo,
        description: feeFines?.list?.length
          ? 'Subtotal do cálculo'
          : getFieldName(labelsEnum.CALC_TOTAL, nomenclatures),
        tax: null,
        type: typeTotal.id,
        total: roundNumber(total),
        currency: getCoin(current.updateTo, 0),
        interestBalance: 0,
        fineBalance: 0,
        value: 0,
        calculationsMemory,
      };

      views.push(totalView);

      const beforeTotal = await feeFineService.calculate({
        feeFines: beforeFeeFines,
        value: total,
        views: this.views,
        isBefore: true,
        account: current,
        calculationsMemory,
        memCalcs,
        nomenclatures,
      });

      const afterTotal = await feeFineService.calculate({
        feeFines: afterFeeFines,
        value: beforeTotal,
        views: this.views,
        isBefore: false,
        account: current,
        calculationsMemory,
        memCalcs,
        nomenclatures,
      });

      feeFinesTotal = afterTotal - total;
      feeFines.total = feeFinesTotal;

      return {
        summary,
        views: this.views,
        authorList: _.cloneDeep(authorList),
        feeFineList: [...beforeFeeFines, ...afterFeeFines],
      };
    } catch (error) {
      throw error;
    }
  }
}
