import _ from 'lodash';
import moment, { Moment } from 'moment';
import { typeFineArt, FeeFineTypes, typeFeeArt, typeTotal } from '@/hooks/interfaces/CurrentAccountHookImp';
import CurrentFeeFineImp from '@/interfaces/calculations/CurrentFeeFineImp';
import { FeeFinesImp, initialFeeArt, initialFineArt } from '@/hooks/currentAccount';
import { getCoin, roundNumber } from '@/utils/numberUtils';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import MonetaryCorrectionService from '@/services/MonetaryCorrectionService';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { valueWithCurrency } from '@/lib/currency';
import AccountImp from '@/interfaces/AccountImp';
import { reorderItemsByIndex } from '@/lib/utils';
import MemCalcImp from '@/interfaces/MemCalcImp';
import { getFieldName } from '@/lib/nomenclature';
import { labelsEnum } from '@/enums/labelsEnum';
import INomenclature from '@/interfaces/NomenclatureImp';

export interface CreateImp {
  feeFines: FeeFinesImp;
  type: FeeFineTypes;
  updateTo: string;
}

export interface DeleteImp {
  feeFineIndex: number;
  feeFines: FeeFinesImp;
}

export interface DuplicateImp {
  feeFineIndex: number;
  feeFines: FeeFinesImp;
}
export interface DateEndImp {
  date: string | null;
  nextOccurrenceDate: Moment;
  updateTo: string;
  isDaily?: boolean;
  isLastOccurrence?: boolean;
}

export default class FeeFineService {
  private monetaryCorrectionService = new MonetaryCorrectionService();

  public create({ type, feeFines, updateTo }: CreateImp): FeeFinesImp {
    const _feeFines = _.cloneDeep(feeFines);
    const feeFine =
      type == typeFineArt.id
        ? { ...initialFineArt, dateEnd: updateTo }
        : { ...initialFeeArt, dateStart: updateTo, dateEnd: updateTo };
    _feeFines.list.push(_.cloneDeep(feeFine));
    return _feeFines;
  }

  public delete({ feeFineIndex, feeFines }: DeleteImp): FeeFinesImp {
    const _feeFines = _.cloneDeep(feeFines);
    _feeFines.list.splice(feeFineIndex, 1);
    return _feeFines;
  }

  public duplicate({ feeFineIndex, feeFines }: DuplicateImp): FeeFinesImp {
    const _feeFines = _.cloneDeep(feeFines);
    const interestFine = _feeFines.list[feeFineIndex];
    _feeFines.list.push(_.assign({}, _.cloneDeep(interestFine)));
    return _feeFines;
  }

  private dateCompare(param1: CurrentFeeFineImp, param2: CurrentFeeFineImp) {
    const dateA = moment(param1.dateEnd, dateFormatEnum.DEFAULT);
    const dateB = moment(param2.dateEnd, dateFormatEnum.DEFAULT);

    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    return 0;
  }

  public orderByDate({ feeFines }: { feeFines: CurrentFeeFineImp[] }) {
    return feeFines.sort(this.dateCompare);
  }

  public orderByOption({ feeFines }: { feeFines: CurrentFeeFineImp[] }) {
    const beforeFeeFines = this.orderByDate({
      feeFines: feeFines.filter(feeFine => !feeFine.afterTotal),
    });
    const afterFeeFines = this.orderByDate({
      feeFines: feeFines.filter(feeFine => !!feeFine.afterTotal),
    });
    return [...beforeFeeFines, ...afterFeeFines];
  }

  private getDatesToCorrection({
    updateTo,
    dateStart,
    dateEnd,
  }: {
    updateTo: string;
    dateStart: string;
    dateEnd: string;
  }) {
    const updateToDate = moment(updateTo, dateFormatEnum.DEFAULT);
    const dateStartDate = moment(dateStart, dateFormatEnum.DEFAULT);
    const dateEndDate = moment(dateEnd, dateFormatEnum.DEFAULT);

    if (dateStartDate.isAfter(updateToDate)) return { dateStart, dateEnd };

    if (dateEndDate.isAfter(updateToDate)) return { dateStart: updateTo, dateEnd };

    return { dateStart: dateEnd, dateEnd };
  }

  private transformate(feeFine: CurrentFeeFineImp): CurrentFeeFineImp {
    return {
      ...feeFine,
      tax: Number(feeFine.tax),
      value: Number(feeFine.value),
    };
  }

  private getCorrectedDescription({ dateStart, dateEnd }: { dateStart: string; dateEnd: string }) {
    const dateStartDate = moment(dateStart, dateFormatEnum.DEFAULT);
    const dateEndDate = moment(dateEnd, dateFormatEnum.DEFAULT);

    if (dateStartDate.isSame(dateEndDate)) return '';
    return `corrigido de ${dateStart} até ${dateEnd}`;
  }

  public reorderByDate({
    feeFines,
    endIndex,
    startIndex,
  }: {
    feeFines: FeeFinesImp;
    startIndex: number;
    endIndex: number;
  }) {
    if (!feeFines.list.length) throw 'not found feeFines list';

    const currentFeeFines = _.cloneDeep(feeFines) as FeeFinesImp;

    const initialFeeFine = feeFines.list[startIndex];
    const finalFeeFine = feeFines.list[endIndex];

    const initialDate = moment(initialFeeFine.dateEnd, dateFormatEnum.DEFAULT);
    const finalDate = moment(finalFeeFine.dateEnd, dateFormatEnum.DEFAULT);

    if (initialDate.isSame(finalDate)) {
      const reorderedFeeFines: CurrentFeeFineImp[] = reorderItemsByIndex(feeFines.list, startIndex, endIndex);
      currentFeeFines.list = reorderedFeeFines;
    }

    return currentFeeFines;
  }

  public async calculate({
    feeFines,
    value,
    views,
    isBefore,
    account,
    calculationsMemory,
    memCalcs,
    nomenclatures,
  }: {
    feeFines: CurrentFeeFineImp[];
    value: number;
    views: ViewOccorrenceImp[];
    isBefore: boolean;
    account: AccountImp;
    calculationsMemory?: string;
    memCalcs: MemCalcImp[];
    nomenclatures: INomenclature[];
  }) {
    let total = roundNumber(value);

    for (let index = 0; index < feeFines.length; index++) {
      const _feeFine = feeFines[index];
      const feeFine = this.transformate(_feeFine);
      const currencyEnd = getCoin(feeFine.dateEnd, 0);

      switch (feeFine.type) {
        case typeFeeArt.id: {
          const { dateStart, dateEnd } = this.getDatesToCorrection({
            updateTo: account.updateTo,
            dateEnd: feeFine.dateEnd,
            dateStart: feeFine.dateStart,
          });

          const currencyStart = getCoin(feeFine.dateStart, 0);

          if (feeFine.tax && feeFine.value) {
            const percentage = feeFine.tax / 100;
            const result = percentage * feeFine.value;

            const { value: newValue } = await this.monetaryCorrectionService.calculate({
              account: { ...account, updateTo: dateEnd },
              date: dateStart,
              value: result,
              memCalcs,
            });

            total += newValue;

            const resultValue = valueWithCurrency(currencyStart, result);
            const startValue = valueWithCurrency(currencyStart, feeFine.value);

            const totalView: ViewOccorrenceImp = {
              balance: roundNumber(newValue),
              updateSince: feeFine.dateStart,
              date: feeFine.dateStart,
              dateEnd: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: `${feeFine.tax.toFixed(
                4
              )} % de ${startValue} = ${resultValue} ${this.getCorrectedDescription({
                dateEnd,
                dateStart,
              })}`,
              tax: null,
              type: typeFeeArt.id,
              total: roundNumber(total),
              currency: currencyStart,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else if (feeFine.tax && !feeFine.value) {
            const percentage = feeFine.tax / 100;
            const result = percentage * roundNumber(value);

            const { value: newValue } = await this.monetaryCorrectionService.calculate({
              account: { ...account, updateTo: dateEnd },
              date: dateStart,
              value: result,
              memCalcs,
            });

            total += newValue;

            const resultValue = valueWithCurrency(currencyStart, result);
            const startValue = valueWithCurrency(currencyStart, value);

            const totalView: ViewOccorrenceImp = {
              balance: roundNumber(newValue),
              updateSince: feeFine.dateStart,
              date: feeFine.dateStart,
              dateEnd: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: `${feeFine.tax.toFixed(
                4
              )} % de ${startValue} = ${resultValue} ${this.getCorrectedDescription({
                dateEnd,
                dateStart,
              })}`,
              tax: null,
              type: typeFeeArt.id,
              total: roundNumber(total),
              currency: currencyStart,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else if (!feeFine.tax && feeFine.value) {
            const result = feeFine.value;
            const { value: newValue, details } = await this.monetaryCorrectionService.calculate({
              account: { ...account, updateTo: dateEnd },
              date: dateStart,
              value: result,
              memCalcs,
            });

            total += newValue;

            const resultValue = valueWithCurrency(currencyStart, result);

            const totalView: ViewOccorrenceImp = {
              balance: roundNumber(newValue),
              updateSince: feeFine.dateStart,
              date: feeFine.dateStart,
              dateEnd: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: `${resultValue} ${this.getCorrectedDescription({ dateEnd, dateStart })}`,
              tax: null,
              type: typeFeeArt.id,
              total: roundNumber(total),
              currency: currencyStart,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else {
            const totalView: ViewOccorrenceImp = {
              balance: 0,
              updateSince: feeFine.dateStart,
              date: null,
              dateEnd: null,
              description: feeFine.description,
              extraDescription: ``,
              tax: null,
              type: typeFeeArt.id,
              total: 0,
              currency: currencyStart,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          }
          break;
        }
        case typeFineArt.id: {
          if (feeFine.tax && feeFine.value) {
            const percentage = feeFine.tax / 100;
            const newValue = percentage * feeFine.value;
            const result = newValue;
            total += result;

            const resultValue = valueWithCurrency(currencyEnd, result);
            const startValue = valueWithCurrency(currencyEnd, feeFine.value);

            const totalView: ViewOccorrenceImp = {
              balance: result,
              updateSince: null,
              date: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: `${feeFine.tax.toFixed(4)} % de ${startValue} = ${resultValue}`,
              tax: null,
              type: typeFineArt.id,
              total: roundNumber(total),
              currency: currencyEnd,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else if (feeFine.tax && !feeFine.value) {
            const percentage = feeFine.tax / 100;
            const result = percentage * roundNumber(value);
            total += result;

            const resultValue = valueWithCurrency(currencyEnd, result);
            const startValue = valueWithCurrency(currencyEnd, value);

            const totalView: ViewOccorrenceImp = {
              balance: result,
              updateSince: null,
              date: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: `${feeFine.tax.toFixed(4)} % de ${startValue} = ${resultValue}`,
              tax: null,
              type: typeFineArt.id,
              total: roundNumber(total),
              currency: currencyEnd,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else if (!feeFine.tax && feeFine.value) {
            const result = feeFine.value;
            total += result;

            const totalView: ViewOccorrenceImp = {
              balance: result,
              updateSince: null,
              date: feeFine.dateEnd,
              description: feeFine.description,
              extraDescription: ``,
              tax: null,
              type: typeFineArt.id,
              total: roundNumber(total),
              currency: currencyEnd,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          } else {
            const totalView: ViewOccorrenceImp = {
              balance: 0,
              updateSince: null,
              date: null,
              dateEnd: null,
              description: feeFine.description,
              extraDescription: ``,
              tax: null,
              type: typeFineArt.id,
              total: 0,
              currency: currencyEnd,
              currencyBalance: currencyEnd,
              interestBalance: 0,
              fineBalance: 0,
              value: 0,
            };

            views.push(totalView);
          }
          break;
        }
      }
    }

    if (!feeFines.length) return total;

    const lastDateEnd = feeFines[feeFines.length - 1].dateEnd;

    const totalView: ViewOccorrenceImp = {
      updateSince: null,
      balance: roundNumber(total),
      date: lastDateEnd,
      description: isBefore
        ? getFieldName(labelsEnum.TOTAL, nomenclatures)
        : getFieldName(labelsEnum.CALC_TOTAL, nomenclatures),
      tax: null,
      type: typeTotal.id,
      total: roundNumber(total),
      currency: getCoin(lastDateEnd, 0),
      interestBalance: 0,
      fineBalance: 0,
      value: 0,
      calculationsMemory,
    };

    views.push(totalView);

    return total;
  }
}
