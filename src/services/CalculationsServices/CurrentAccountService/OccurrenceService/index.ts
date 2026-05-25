import _ from 'lodash';
import moment, { Moment } from 'moment';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentOccurrenceImp, { CurrentExpenseImp } from '@interfaces/calculations/CurrentOccurrenceImp';
import {
  CurrentAuthorTypes,
  OccurrenceTypes,
  typeFee,
  typePayment,
  initialFeeOccurrence,
  initialInstallmentOccurrence,
  typeinstallment,
  typeCorrection,
  CurrentAccountImp,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import ViewOccorrenceImp from '@interfaces/calculations/ViewOccorrenceImp';
import MonetaryCorrectionService from '../../../MonetaryCorrectionService';
import { CurrentTypes, typeArt354, typeProportional } from '@/data/calculations/currentTypes';
import { reorderItemsByIndex } from '@/lib/utils';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { getCoin, roundNumber } from '@/utils/numberUtils';
import { valueWithCurrency } from '@/lib/currency';
import CurrentMonetaryCorrectionService from '../MonetaryCorrection';
import CurrentAccountService, { AllMemcalcsImp, calcPercentage } from '../AccountService';
import { DateEndImp, DateStartImp } from '../InterestsFineService';
import { doConversion } from '@/utils/conversionHelper';
import { labelsEnum } from '@/enums/labelsEnum';
import MemCalcImp from '@/interfaces/MemCalcImp';
import FeeNewCpcService from '../FeeNewCpcService';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import INomenclature from '@/interfaces/NomenclatureImp';
import { getFieldName } from '@/lib/nomenclature';
import { FeeFinesImp } from '@/hooks/currentAccount';
import LawImp from '@/interfaces/Law';
import { initialAccountPagination } from '@/store/simple/reducer';

export interface CalculateImp {
  occurrence: {
    next: CurrentOccurrenceImp;
    current: CurrentOccurrenceImp;
  };
  account: CurrentAccountImp;
  views: ViewOccorrenceImp[];
  interestTotal: number;
  fineTotal: number;
  occurrencesLength: number;
  balance: number;
  occurrenceIndex: number;
  type: CurrentTypes;
  isTest?: boolean;
  memCalcs: MemCalcImp[];
  allMemcalcs: AllMemcalcsImp;
  interestIndexes: InterestIndexesImp;
  nomenclatures: INomenclature[];
  feeFines: FeeFinesImp;
  author: CurrentAuthorTypes;
  interestIndexesFromLaw: LawImp[];
  authorIndex: number;
}
export interface CreateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  updateTo: string;
  type: OccurrenceTypes;
  newestOccurrence: boolean;
  isStart?: boolean;
}

export type CreateResponseImp = CurrentAuthorImp[];

export interface DeleteImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  occurrenceIndex: number;
}

export type DeleteResponseImp = CurrentAuthorImp[];

export interface UpdateImp {}

export interface DuplicateImp {
  authorList: CurrentAuthorImp[];
  authorIndex: number;
  occurrenceIndex: number;
}

export type DuplicateResponseImp = CurrentAuthorImp[];

export interface UpdateResponseImp {}

export default class OccurrenceService {
  protected balance = 0;
  protected interestTotal = 0;
  protected fineTotal = 0;
  protected defaultTotal = 0;
  protected compensatoryTotal = 0;
  protected compoundTotal = 0;
  protected views: ViewOccorrenceImp[] = [];
  protected monetaryCorrectionService = new MonetaryCorrectionService();
  private currentMonetaryCorrectionService = new CurrentMonetaryCorrectionService();

  private deductedInterestTotal = 0;
  private deductedBalance = 0;
  private deductedBalanceClone = 0;

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

  public orderByDate({
    author,
    authorIndex,
    endIndex,
    startIndex,
  }: {
    author: CurrentAuthorTypes;
    authorIndex: number;
    startIndex: number;
    endIndex: number;
  }) {
    if (!author.list.length) throw 'not found author list';

    const currentAuthor = _.cloneDeep(author) as CurrentAuthorTypes;
    const authorList = currentAuthor.list[authorIndex];
    const occurrences = authorList.occurrences;

    const initialOccurrence = occurrences[startIndex];
    const finalOccurrence = occurrences[endIndex];

    const initialDate = moment(initialOccurrence.date, dateFormatEnum.DEFAULT);
    const finalDate = moment(finalOccurrence.date, dateFormatEnum.DEFAULT);

    if (initialDate.isSame(finalDate)) {
      const reorderedOccurrences: CurrentOccurrenceImp[] = reorderItemsByIndex(occurrences, startIndex, endIndex);
      this.cleanOccurrenceActive(reorderedOccurrences);
      authorList.occurrences = reorderedOccurrences;
    }

    return currentAuthor;
  }

  public changeUpdateTo(occurrences: CurrentOccurrenceImp[], lastUpdateTo: string, updateTo: string) {
    occurrences.forEach(currentOccurrence => {
      const updateToIsSameOccurrenceDate = moment(currentOccurrence.date, dateFormatEnum.DEFAULT).isSame(
        moment(lastUpdateTo, dateFormatEnum.DEFAULT)
      );

      if (updateToIsSameOccurrenceDate && currentOccurrence.type == typeFee.id) currentOccurrence.date = updateTo;
    });

    return occurrences;
  }

  public order(param: CurrentOccurrenceImp[]): CurrentOccurrenceImp[] {
    return param.sort(this.dateCompare);
  }

  public duplicate({ authorList, authorIndex, occurrenceIndex }: DuplicateImp): DuplicateResponseImp {
    const newAuthorList = _.cloneDeep(authorList);
    const occurrences = newAuthorList[authorIndex].occurrences;
    const occurrence: CurrentOccurrenceImp = occurrences[occurrenceIndex];

    this.cleanOccurrenceActive(occurrences);

    const newOccurrence: CurrentOccurrenceImp = _.assign(
      {},
      _.cloneDeep({
        ...occurrence,
        newestOccurrence: true,
        date: moment(occurrence.date, dateFormatEnum.DEFAULT).add(1, 'M').format(dateFormatEnum.DEFAULT),
      })
    ) as CurrentOccurrenceImp;

    newAuthorList[authorIndex].occurrences.push(newOccurrence);
    newAuthorList[authorIndex].occurrenceTotal = 0;

    return newAuthorList;
  }

  private checkLimitDate(finalDate: Moment, limitDate: Moment) {
    return finalDate.isAfter(limitDate) ? true : false;
  }

  private getDateStart({ date, updateTo, isDaily = false }: DateStartImp) {
    const dateStart = moment(date || updateTo, dateFormatEnum.DEFAULT);

    return dateStart.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
  }

  private getDateEnd({ date, nextOccurrenceDate, updateTo, isDaily = false }: DateEndImp) {
    const dateEnd = moment(date || updateTo, dateFormatEnum.DEFAULT);

    if (dateEnd.isSameOrBefore(nextOccurrenceDate))
      return dateEnd.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
    else return nextOccurrenceDate.format(isDaily ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY);
  }

  private async getPaymentDescription(current: CurrentOccurrenceImp, nomenclatures: INomenclature[]) {
    this.balance = roundNumber(this.balance);

    if (this.deductedBalance > this.balance) this.deductedBalance -= this.balance;
    else this.deductedBalance = 0;

    if (this.deductedInterestTotal > this.interestTotal) this.deductedInterestTotal -= this.interestTotal;
    else this.deductedInterestTotal = 0;

    const currencyStart = getCoin(String(current.date), 0);

    const occurrenceDetail = `principal ${valueWithCurrency(
      currencyStart,
      this.deductedBalanceClone
    )} = ${valueWithCurrency(currencyStart, this.deductedBalance)}`;

    const interestDetail = `${getFieldName(labelsEnum.INTEREST, nomenclatures)} ${valueWithCurrency(
      currencyStart,
      this.deductedInterestTotal
    )}`;

    const getDescriptionCalc = () => {
      if (this.deductedBalance && this.deductedInterestTotal > 0)
        return `Amortizado primeiro o saldo dos ${interestDetail}  ${
          this.deductedBalance ? `e do ${occurrenceDetail}` : ''
        }`;

      if (!this.deductedBalance && this.deductedInterestTotal > 0) return `Amortizado: o saldo dos ${interestDetail}`;

      return `Amortizado o saldo do ${occurrenceDetail}`;
    };

    const payloadView: ViewOccorrenceImp = {
      updateSince: null,
      balance: this.balance,
      date: String(current.date),
      description: current.description,
      currency: getCoin(String(current.date), 0),
      tax: current.tax,
      descriptionCalc: getDescriptionCalc(),
      type: current.type,
      interestBalance: this.interestTotal,
      fineBalance: this.fineTotal,
      value: -current.value,
      total: this.balance + this.interestTotal + this.fineTotal,
    };

    this.views.push(payloadView);
  }

  public async calculate({
    interestTotal,
    fineTotal,
    occurrence: { current, next },
    account,
    type: currentAccountType,
    balance,
    views,
    isTest,
    memCalcs,
    allMemcalcs,
    interestIndexes,
    nomenclatures,
    author,
    feeFines,
    interestIndexesFromLaw,
    authorIndex,
    occurrenceIndex,
  }: CalculateImp) {
    console.info('calculate_occurrence');

    this.views = views;
    this.interestTotal = interestTotal;
    this.fineTotal = fineTotal;
    this.balance = balance;

    let correction;

    const updateToDate = moment(account.current.updateTo, dateFormatEnum.DEFAULT);
    const currentOccurrenceDate = moment(current.date, dateFormatEnum.DEFAULT);
    const nextOccurrenceDate = next?.date ? moment(next.date, dateFormatEnum.DEFAULT) : updateToDate;

    current.newestOccurrence = false;

    this.deductedInterestTotal = this.interestTotal;
    this.deductedBalance = this.balance;
    this.deductedBalanceClone = this.balance;
    switch (current.type) {
      case typePayment.id: {
        switch (currentAccountType) {
          case typeArt354.id: {
            if (this.interestTotal < 0) {
              this.balance -= current.value;
            } else if (this.interestTotal > current.value) {
              this.interestTotal -= current.value;
            } else {
              let newOccurrenceValue = current.value;
              newOccurrenceValue -= this.interestTotal;
              this.compoundTotal = 0;
              this.compensatoryTotal = 0;
              this.defaultTotal = 0;
              this.interestTotal = 0;
              this.balance -= newOccurrenceValue;
            }
            this.getPaymentDescription(current, nomenclatures);
            break;
          }
          case typeProportional.id: {
            const currencyStart = getCoin(String(current.date), 0);
            const interestPlusBalance = this.interestTotal + this.balance;
            let percentageInterest = this.interestTotal / interestPlusBalance;
            let percentageBalance = this.balance / interestPlusBalance;

            const newInterestTotal = roundNumber(percentageInterest * current.value);
            const newBalance = roundNumber(percentageBalance * current.value);

            percentageInterest = percentageInterest * 100;
            percentageBalance = percentageBalance * 100;

            let hasDesc = false;

            if (this.interestTotal > newInterestTotal) {
              this.interestTotal -= newInterestTotal;
              this.balance -= newBalance;
            } else if (this.interestTotal < newInterestTotal) {
              hasDesc = true;
              const interestRest = newInterestTotal - this.interestTotal;
              this.interestTotal = 0;
              this.compoundTotal = 0;
              this.compensatoryTotal = 0;
              this.defaultTotal = 0;
              this.balance -= interestRest;
              this.balance -= newBalance;

              const getDescriptionCalc = () => {
                let desc = '';
                const mainDesc = `Amortizado do Principal ${percentageBalance.toFixed(4)}% de ${valueWithCurrency(
                  currencyStart,
                  current.value
                )} = ${valueWithCurrency(currencyStart, newBalance)} sobre saldo de ${valueWithCurrency(
                  currencyStart,
                  this.deductedBalance
                )} = ${valueWithCurrency(
                  currencyStart,
                  this.balance + interestRest
                )} somado ao resto do Juros -${valueWithCurrency(currencyStart, interestRest)} = ${valueWithCurrency(
                  currencyStart,
                  this.balance
                )} \n`;

                desc += mainDesc;

                const interestDes = `Amortizado do Juros ${percentageInterest.toFixed(4)}% de ${valueWithCurrency(
                  currencyStart,
                  current.value
                )} = ${valueWithCurrency(currencyStart, newInterestTotal)} sobre o saldo de ${valueWithCurrency(
                  currencyStart,
                  this.deductedInterestTotal
                )} = ${valueWithCurrency(currencyStart, this.interestTotal)}`;

                if (this.interestTotal) desc += interestDes;

                return desc;
              };

              const payloadView: ViewOccorrenceImp = {
                updateSince: null,
                balance: this.balance,
                date: String(current.date),
                description: current.description,
                currency: getCoin(String(current.date), 0),
                tax: current.tax,
                descriptionCalc: getDescriptionCalc(),
                type: current.type,
                interestBalance: this.interestTotal,
                fineBalance: this.fineTotal,
                value: -current.value,
                total: this.balance + this.interestTotal + this.fineTotal,
              };

              this.views.push(payloadView);
            } else {
              this.balance -= newBalance;
            }

            if (!hasDesc) {
              this.balance = roundNumber(this.balance);

              const getDescriptionCalc = () => {
                let desc = '';
                const mainDesc = `Amortizado do Principal ${percentageBalance.toFixed(4)}% de ${valueWithCurrency(
                  currencyStart,
                  current.value
                )} = ${valueWithCurrency(currencyStart, newBalance)} sobre saldo de ${valueWithCurrency(
                  currencyStart,
                  this.deductedBalance
                )} = ${valueWithCurrency(currencyStart, this.balance)}\n`;

                desc += mainDesc;

                const interestDes = `Amortizado do Juros ${percentageInterest.toFixed(4)}% de ${valueWithCurrency(
                  currencyStart,
                  current.value
                )} = ${valueWithCurrency(currencyStart, newInterestTotal)} sobre o saldo de ${valueWithCurrency(
                  currencyStart,
                  this.deductedInterestTotal
                )} = ${valueWithCurrency(currencyStart, this.interestTotal)}`;

                if (this.interestTotal) desc += interestDes;

                return desc;
              };

              const payloadView: ViewOccorrenceImp = {
                updateSince: null,
                balance: this.balance,
                date: String(current.date),
                description: current.description,
                currency: getCoin(String(current.date), 0),
                tax: current.tax,
                descriptionCalc: getDescriptionCalc(),
                type: current.type,
                interestBalance: this.interestTotal,
                fineBalance: this.fineTotal,
                value: -current.value,
                total: this.balance + this.interestTotal + this.fineTotal,
              };

              this.views.push(payloadView);
            }
            break;
          }
          default: {
            this.balance -= current.value;
            this.getPaymentDescription(current, nomenclatures);
          }
        }
        break;
      }
      case typeFee.id: {
        let feeValue = 0;
        let extraDescription = '';
        const balancePlusInterest = this.balance + this.interestTotal;
        if (current.isCalcByInstallment && !current.isFeeCpc) {
          const newAuthor = _.cloneDeep(author);
          const authorFiltered: CurrentAuthorTypes = {
            list: [newAuthor.list[authorIndex]],
            pagination: initialAccountPagination,
          };
          const currentAccountService = new CurrentAccountService();

          const element = newAuthor.list[authorIndex];
          element.expenses = [];
          element.occurrences = element.occurrences.filter(
            (occurrence, index) =>
              occurrence.type == typeinstallment.id &&
              moment(occurrence.date, dateFormatEnum.DEFAULT).isSameOrBefore(
                moment(current.date, dateFormatEnum.DEFAULT)
              ) &&
              index < occurrenceIndex
          );

          const { views } = await currentAccountService.calculate({
            account: {
              ...account,
              current: { ...account.current, updateTo: current.date || account.current.updateTo },
            },
            allMemcalcs,
            author: authorFiltered,
            feeFines,
            interestIndexes,
            interestIndexesFromLaw,
            memCalcs,
            nomenclatures,
            authorIndex,
          });

          const [view] = views.filter((view: ViewOccorrenceImp) => view.type == typeTotal.id);
          current.value = view.balance;
        }

        if (!current.isCalcByInstallment && current.isFeeCpc) {
          const feeNewCpcService = new FeeNewCpcService({
            views: this.views,
            balance,
            interestTotal,
            nomenclatures,
            type: currentAccountType,
            interestIndexesFromLaw,
          });

          const salarioMinimoMemCalc = allMemcalcs[67];

          current.salariominimo?.isCalc && feeNewCpcService.salariominimo(current.salariominimo, salarioMinimoMemCalc);

          if (current.quantiacerta && !current.salariominimo?.isCalc) {
            const correction = { ...current.quantiacerta, proRataDay: account.current.proRataDay };
            const payload = feeNewCpcService.quantiacerta(
              current.quantiacerta?.interest,
              interestIndexes,
              allMemcalcs,
              correction,
              current.description
            );

            this.balance = payload.balance;
            this.interestTotal = payload.interestTotal;
          }
        }

        const value = current.value || balancePlusInterest;

        const hasSameDate = moment(current.date, dateFormatEnum.DEFAULT).isSame(
          moment(current.updateSince, dateFormatEnum.DEFAULT)
        );

        const percentageRate = current.tax ? current.tax / 100 : hasSameDate ? 1 : 0;

        const getInfo = (value?: number) => {
          const dataChecked = this.checkLimitDate(currentOccurrenceDate, updateToDate);
          dataChecked ? this.balance : (this.balance += feeValue);

          const startDate = this.getDateStart({
            date: current.updateSince,
            currentOccurrenceDate: currentOccurrenceDate,
            updateTo: account.current.updateTo,
            isDaily: account.current.proRataDay,
          });

          const payloadView: ViewOccorrenceImp = {
            updateSince: current.updateSince,
            balance: this.balance,
            date: startDate,
            dateEnd: current.date,
            currency: getCoin(current.date || startDate, 0),
            description: current.description,
            tax: current.tax || null,
            type: typeFee.id,
            interestBalance: this.interestTotal,
            fineBalance: this.fineTotal,
            value: dataChecked ? 0 : value || feeValue,
            extraDescription,
            total: this.balance + this.interestTotal + this.fineTotal,
          };

          payloadView.value && this.views.push(payloadView);
        };

        if (current.updateSince && !current.isFeeCpc) {
          const currentCorrectionPayload = {
            date: this.getDateStart({
              date: current.updateSince,
              currentOccurrenceDate,
              updateTo: account.current.updateTo,
              isDaily: account.current.proRataDay,
            }),
            value: percentageRate * value,
            account: {
              ...account,
              updateTo: this.getDateEnd({
                date: current.date,
                nextOccurrenceDate,
                updateTo: account.current.updateTo,
                isDaily: account.current.proRataDay,
              }),
            },
          };

          let currency = '';

          if (current.date) currency = getCoin(current.date, 0);

          const noValueWithTax = !current.value && current.tax;

          if (noValueWithTax) {
            feeValue = percentageRate * value;
            extraDescription = `${(percentageRate * 100).toFixed(4)}% sobre o total de ${valueWithCurrency(
              currency,
              value
            )} = ${valueWithCurrency(currency, feeValue)}`;

            getInfo();
          }

          const noTaxWithValue = !current.tax && current.value;

          if (noTaxWithValue) {
            if (hasSameDate) {
              feeValue = value;
              extraDescription = '';
            } else {
              extraDescription = `${valueWithCurrency(currency, value)} atualizado desde ${current.updateSince} = `;

              correction = await this.monetaryCorrectionService.calculate({
                account: currentCorrectionPayload.account.current,
                date: currentCorrectionPayload.date,
                value,
                memCalcs,
                isTest,
              });

              feeValue = correction.value;
              if (!hasSameDate) extraDescription += valueWithCurrency(currency, feeValue);
            }

            getInfo();
          }

          const hasTaxAndValue = current.tax && current.value;
          if (hasTaxAndValue) {
            correction = this.monetaryCorrectionService.calculate({
              account: currentCorrectionPayload.account.current,
              date: currentCorrectionPayload.date,
              value: currentCorrectionPayload.value,
              isTest,
              memCalcs,
            });

            if (current.isCalcByInstallment) {
              extraDescription = `${(percentageRate * 100).toFixed(4)}% sobre ${valueWithCurrency(
                currency,
                value
              )} em ${current.date} = `;

              feeValue = percentageRate * value;
            } else if (hasSameDate) {
              extraDescription = `${(percentageRate * 100).toFixed(4)}% sobre ${valueWithCurrency(
                currency,
                value
              )} em ${current.date} = `;

              feeValue = percentageRate * value;
            } else {
              extraDescription = `${(percentageRate * 100).toFixed(4)}% sobre ${valueWithCurrency(
                currency,
                value
              )} atualizado desde ${current.updateSince} = `;

              feeValue = percentageRate * correction.value;
            }

            extraDescription += valueWithCurrency(currency, feeValue);
            getInfo(feeValue);
          }
        }
        break;
      }
      case typeinstallment.id: {
        const currencyCorrection = getCoin(current.date, 0);

        const { correctionValue, balanceTotal, details } = current.isWithoutCorrection
          ? await this.currentMonetaryCorrectionService.calculate({
              account: account.current,
              isTest,
              balance: this.balance,
              correctedFrom: current.type,
              dates: { currentDate: currentOccurrenceDate, nextDate: next ? nextOccurrenceDate : updateToDate },
              memCalcs,
            })
          : { correctionValue: 0, balanceTotal: 0, details: [] };

        const description = `${current.description.length ? current.description : labelsEnum.INSTALLMENTS} ${
          current.isWithoutCorrection
            ? `(${labelsEnum.WITHOUT.toLowerCase()} ${labelsEnum.CORRECTION.toLowerCase()})`
            : ''
        }`;

        if (current.isWithoutCorrection) {
          const percentage = calcPercentage(balanceTotal, correctionValue);
          const descriptionCalc = ` (${percentage}) sobre principal ${valueWithCurrency(
            currencyCorrection,
            this.balance
          )}`;

          this.balance += current.value;

          const payloadView: ViewOccorrenceImp = {
            updateSince: null,
            balance: this.balance,
            date: current.date,
            currency: getCoin(current.date, 0),
            description,
            tax: current.tax,
            fineBalance: this.fineTotal,
            interestBalance: this.interestTotal,
            type: current.type,
            isWithoutCorrection: current.isWithoutCorrection,
            value: current.value,
            total: this.balance + this.interestTotal + this.fineTotal,
            details,
          };

          this.views.push(payloadView);

          this.balance = doConversion(this.balance, current.date, next?.date || account.current.updateTo);
          this.balance += correctionValue;

          const dateEnd = next?.date || account.current.updateTo;

          const correctionView: ViewOccorrenceImp = {
            updateSince: null,
            balance: this.balance,
            date: current.date,
            dateEnd,
            currency: getCoin(dateEnd, 0),
            description: descriptionCalc,
            tax: current.tax,
            interestBalance: this.interestTotal,
            fineBalance: this.fineTotal,
            type: typeCorrection.id,
            correctedFrom: current.type,
            isWithoutCorrection: current.isWithoutCorrection,
            value: correctionValue,
            total: this.balance + this.interestTotal + this.fineTotal,
          };

          if (roundNumber(correctionValue)) this.views.push(correctionView);

          return { views: this.views, balanceTotal: this.balance, interestTotal: this.interestTotal };
        }

        this.balance += current.value;
        const payloadView: ViewOccorrenceImp = {
          updateSince: null,
          balance: this.balance,
          date: current.date,
          currency: getCoin(current.date, 0),
          description,
          tax: current.tax,
          type: current.type,
          isWithoutCorrection: current.isWithoutCorrection,
          value: current.value,
          total: this.balance + this.interestTotal + this.fineTotal,
          interestBalance: this.interestTotal,
          fineBalance: this.fineTotal,
          details,
        };
        this.views.push(payloadView);
        break;
      }
      default: {
        this.balance += current.value;

        const payloadView: ViewOccorrenceImp = {
          updateSince: null,
          balance: this.balance,
          date: current.date,
          currency: getCoin(current.date, 0),
          description: current.description,
          tax: current.tax,
          type: current.type,
          interestBalance: this.interestTotal,
          fineBalance: this.fineTotal,
          value: current.value,
          total: this.balance + this.interestTotal + this.fineTotal,
        };

        this.views.push(payloadView);
        break;
      }
    }
    return { views: this.views, balanceTotal: this.balance, interestTotal: this.interestTotal, current };
  }

  public create({
    authorList,
    authorIndex,
    type,
    newestOccurrence,
    updateTo,
    isStart = true,
  }: CreateImp): CreateResponseImp {
    const newAuthorList = _.cloneDeep(authorList);
    const occurrences: CurrentOccurrenceImp[] = newAuthorList[authorIndex].occurrences;
    const isFeeType = type == typeFee.id;

    this.cleanOccurrenceActive(occurrences);

    const newOccurrence = isFeeType
      ? (_.cloneDeep({
          ...initialFeeOccurrence,
          date: updateTo,
          updateSince: updateTo,
          type,
          newestOccurrence,
          tax: 0,
        }) as CurrentOccurrenceImp)
      : (_.cloneDeep({
          ...initialInstallmentOccurrence,
          date: updateTo,
          newestOccurrence,
          type,
        }) as CurrentOccurrenceImp);

    isStart ? occurrences.unshift(newOccurrence) : occurrences.push(newOccurrence);
    newAuthorList[authorIndex].occurrenceTotal = 0;

    if (!newAuthorList[authorIndex].smallerDate)
      newAuthorList[authorIndex].smallerDate = newOccurrence.date || undefined;

    return newAuthorList;
  }

  public cleanOccurrenceActive(occurrences: CurrentOccurrenceImp[]) {
    const filteredOccurrences = occurrences.filter(occurrence => occurrence.newestOccurrence);

    filteredOccurrences.forEach(occurrence => {
      occurrence.newestOccurrence = false;
    });
  }

  public delete({ authorList, authorIndex, occurrenceIndex }: DeleteImp): DeleteResponseImp {
    const newAuthorList = _.cloneDeep(authorList);
    const occurrences = newAuthorList[authorIndex].occurrences;
    this.cleanOccurrenceActive(occurrences);

    occurrences.splice(occurrenceIndex, 1);
    newAuthorList[authorIndex].occurrenceTotal = 0;
    if (!occurrences.length) newAuthorList[authorIndex].smallerDate = undefined;
    return newAuthorList;
  }
}
