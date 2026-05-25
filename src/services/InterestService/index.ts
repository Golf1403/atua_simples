import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import CalculateCoumpoundInterest from './CalculateCoumpoundInterest';
import CalculateSimpleInterest, { formatPeriodPercentage, formatResult } from './CalculateSimpleInterest';
import moment, { Moment } from 'moment';
import { typeCompound, typePeriod } from '@data/calculations/interestTypes';
import { transitiveInterestTypes, typeSavings } from '@data/calculations/civilCodeTypes';
import MonetaryFineImp, { PeriodImp } from '@interfaces/calculations/MonetaryFineImp';
import { getTimeByRange } from '../../utils/getTimeByRange';
import { fineAmountType, finePercentageType } from '@data/calculations/fineEntryTypes';
import { formatPtBr } from '@lib/utils';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import Decimal from 'decimal.js';
import { frequencyDayDaily } from '@/data/calculations/frequencyDaysTypes';

export interface TransitiveImp {
  time: number;
  periods: PeriodImp[];
}
export interface CalculateInterestImp {
  periods: PeriodImp[];
  result: number;
  value: number;
  totalPercentage: number;
}

class CalculateInterest {
  protected totalPercentage = 0;
  protected calculated = 0;
  protected periods: PeriodImp[] = [];
  protected isTransitive = false;

  calculateInterestPercentage(
    interest: MonetaryInterestImp | MonetaryFineImp,
    transitive?: TransitiveImp,
    capitalizationPercentage?: number,
    timeProRata?: number
  ) {
    const timeByRange = getTimeByRange({
      end: interest.dateEnd,
      periodicity: interest.periodicity,
      start: interest.dateStart,
    });
    const isDayPeriodicity = interest.periodicity === typePeriod.id;
    const time = transitive ? transitive.time : isDayPeriodicity ? 1 : timeByRange;
    this.totalPercentage = capitalizationPercentage
      ? capitalizationPercentage * 100
      : timeProRata || time * interest.percentage;
  }

  private getNomenclature(interest: MonetaryInterestImp) {
    const isSavingsCivilCode = interest.civilCode === typeSavings.id;
    return this.isTransitive ? (isSavingsCivilCode ? `poupança nova` : '') : `${interest.percentage.toFixed(4)} %`;
  }

  private getPeriodsIfNotTrasitive(interest: MonetaryFineImp) {
    const currentPeriods: PeriodImp[] = [];
    switch (interest.type) {
      case fineAmountType.id: {
        const value = interest.percentage;

        currentPeriods.push({
          from: moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
          to: moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
          percentage: this.calculated,
          nomenclature: `${formatPtBr.format(value)}`,
          calculated: this.calculated,
        });
        break;
      }
      default:
        currentPeriods.push({
          from: moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
          to: moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(this.totalPercentage),
          nomenclature: `${interest.percentage.toFixed(4)} %`,
          calculated: formatResult(this.calculated),
        });
    }
    return currentPeriods;
  }

  private getPeriodsIfTrasitive(interest: MonetaryInterestImp, periods?: PeriodImp[]) {
    const nomenclature = this.getNomenclature(interest);

    const periodDefault: PeriodImp[] = [
      {
        from: moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        to: moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(this.totalPercentage),
        nomenclature,
        calculated: formatResult(this.calculated),
      },
      {
        from: moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        to: moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(this.totalPercentage),
        nomenclature: `total do período`,
        calculated: formatResult(this.calculated),
      },
    ];

    return periods ? periods : periodDefault;
  }

  private getPeriods(interest: MonetaryInterestImp | MonetaryFineImp, periods?: PeriodImp[]) {
    const currentFine = interest as MonetaryFineImp;
    const currentInterest = interest as MonetaryInterestImp;

    const isTransitive = transitiveInterestTypes.find(transitive => {
      return transitive == currentInterest.civilCode;
    });
    this.isTransitive = !!isTransitive;

    if (isTransitive) return this.getPeriodsIfTrasitive(currentInterest, periods);
    return this.getPeriodsIfNotTrasitive(currentFine);
  }

  private calculateProRata(date: Moment, tax: number, days?: number, composition?: boolean) {
    const percentage = new Decimal(tax);
    const dateDay = new Decimal(Number(date.format('DD')));

    const daysInFromMonth = date.daysInMonth();

    const daysInFromMonthDiff = new Decimal(daysInFromMonth);

    const difference = days ? new Decimal(days) : daysInFromMonthDiff.minus(dateDay).plus(1);

    const taxByDayOfMonth = percentage.div(daysInFromMonth);
    const differenceUsed = composition ? difference : dateDay.minus(1);

    const proRata = differenceUsed.times(taxByDayOfMonth);

    return Number(proRata.toString());
  }

  private calculateInterest(dateStart: Moment, dateEnd: Moment, percentage: number) {
    if (dateStart.isSameOrAfter(dateEnd)) return 0;

    const time = getTimeByRange({
      start: dateStart.format(dateFormatEnum.ONE_DAY),
      end: dateEnd.format(dateFormatEnum.ONE_DAY),
      periodicity: 'month',
    });

    return time * percentage;
  }

  public run(
    interest: MonetaryInterestImp | MonetaryFineImp,
    transitive?: TransitiveImp,
    proRata?: boolean,
    composition: boolean = false
  ): CalculateInterestImp {
    const currentInterest = interest as MonetaryInterestImp;

    if (
      moment(currentInterest.dateStart, dateFormatEnum.DEFAULT).isAfter(
        moment(currentInterest.dateEnd, dateFormatEnum.DEFAULT)
      ) ||
      moment(currentInterest.dateEnd, dateFormatEnum.DEFAULT).isBefore(
        moment(currentInterest.dateStart, dateFormatEnum.DEFAULT)
      )
    )
      return {
        periods: [],
        result: 0,
        value: currentInterest.calculatedInfo.value,
        totalPercentage: 0,
      };

    const isCompound = currentInterest.type == typeCompound.value;
    if (isCompound) {
      const calculateCoumpoundInterest = new CalculateCoumpoundInterest();
      const coumpound = calculateCoumpoundInterest.calculate(currentInterest, transitive);
      this.calculateInterestPercentage(currentInterest, transitive, coumpound.capitalizationPercentage);
      this.calculated = coumpound.interestResult;
    } else {
      if (proRata && !transitive?.time && !interest.periodicity.includes(frequencyDayDaily.value)) {
        const tax = interest.percentage;
        const initialDate = moment(interest.dateStart, dateFormatEnum.DEFAULT);
        const endDate = moment(interest.dateEnd, dateFormatEnum.DEFAULT);

        const isSameMonthAndYear = endDate.month() == initialDate.month() && endDate.year() == initialDate.year();
        const initialProRata = this.calculateProRata(
          initialDate,
          tax,
          isSameMonthAndYear ? Number(endDate.diff(initialDate, 'days')) : undefined,
          isSameMonthAndYear ? false : true
        );

        const endProRata = isSameMonthAndYear ? 0 : this.calculateProRata(endDate, tax, undefined, composition);
        const interestMonth = this.calculateInterest(initialDate.add(1, 'month'), endDate, interest.percentage);
        const time = interestMonth + initialProRata + endProRata;
        this.calculateInterestPercentage(interest, transitive, undefined, time);
        this.calculated = interest.calculatedInfo.value * (time / 100);
        this.periods = this.getPeriods(currentInterest);
      } else {
        const calculateSimpleInterest = new CalculateSimpleInterest();
        this.calculateInterestPercentage(interest, transitive);
        const simple = calculateSimpleInterest.calculate(interest, transitive);
        this.calculated = simple.interestResult;
        this.periods = this.getPeriods(currentInterest, transitive?.periods);
      }
    }

    return {
      periods: this.periods,
      result: formatResult(this.calculated),
      value: currentInterest.calculatedInfo.value,
      totalPercentage: formatPeriodPercentage(this.totalPercentage),
    };
  }
}

export default CalculateInterest;
