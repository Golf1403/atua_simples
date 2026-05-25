import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { labelsEnum } from '@/enums/labelsEnum';
import { PeriodImp } from '@/interfaces/calculations/MonetaryFineImp';
import LawImp from '@/interfaces/Law';
import { formatPeriodPercentage } from '@/services/InterestService/CalculateSimpleInterest';
import { getTimeByRange } from '@/utils/getTimeByRange';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
export default class MonthlyBeforeLaw {
  protected updateTo = moment('24/10/2024', dateFormatEnum.DEFAULT);
  protected from = moment('01/07/2024', dateFormatEnum.DEFAULT);
  protected tax = 1;
  protected value = 1000;
  protected taxs: number[] = [];
  protected periods: PeriodImp[] = [];
  protected calculated: number = 0;
  protected subtotal: number = 0;
  protected fromDay = Number(this.from.format('DD'));
  protected law = moment('30/08/2024', dateFormatEnum.DEFAULT);
  protected dateFromOneDay = moment(this.from.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
  protected dateLawOneDay = moment(this.law.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
  protected updateToOneDay = moment(this.updateTo.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);

  protected onePercentFromProRataDay = true;

  protected indexValues: LawImp[] = [
    {
      inadata: '2024-07-01T00:00:00.000Z',
      selicValue: '0.9071220000',
      IPCA15Value: '0.3000000000',
      factorSubstractResult: '0.605306081754735793',
      dateApply: 31,
      monthApply: '8/2024',
      dailyPercent: '0.0195260026372495416975',
    },
    {
      inadata: '2024-08-01T00:00:00.000Z',
      selicValue: '0.8675120000',
      IPCA15Value: '0.1900000000',
      factorSubstractResult: '0.676227168380077852',
      dateApply: 30,
      monthApply: '9/2024',
      dailyPercent: '0.0225409056126692617360',
    },
    {
      inadata: '2024-09-01T00:00:00.000Z',
      selicValue: '0.8351570000',
      IPCA15Value: '0.1300000000',
      factorSubstractResult: '0.704241486068111455',
      dateApply: 31,
      monthApply: '10/2024',
      dailyPercent: '0.0227174672925197243583',
    },
    {
      inadata: '2024-10-01T00:00:00.000Z',
      selicValue: '0.9279580000',
      IPCA15Value: '0.5400000000',
      factorSubstractResult: '0.385874278893972548',
      dateApply: 30,
      monthApply: '11/2024',
      dailyPercent: '0.0128624759631324182747',
    },
    {
      inadata: '2024-11-01T00:00:00.000Z',
      selicValue: '0.7929900000',
      IPCA15Value: '0.6200000000',
      factorSubstractResult: '0.171924070761280064',
      dateApply: 31,
      monthApply: '12/2024',
      dailyPercent: '0.0055459377664929052776',
    },
    {
      inadata: '2024-12-01T00:00:00.000Z',
      selicValue: '0.9314310000',
      IPCA15Value: '0.3400000000',
      factorSubstractResult: '0.589426948375523221',
      dateApply: 31,
      monthApply: '1/2025',
      dailyPercent: '0.0190137725282426845499',
    },
    {
      inadata: '2025-01-01T00:00:00.000Z',
      selicValue: '1.0132010000',
      IPCA15Value: '0.1100000000',
      factorSubstractResult: '0.902208570572370393',
      dateApply: 28,
      monthApply: '2/2025',
      dailyPercent: '0.0322217346632989425917',
    },
    {
      inadata: '2025-02-01T00:00:00.000Z',
      selicValue: '0.9853220000',
      IPCA15Value: '1.2300000000',
      factorSubstractResult: '-0.241705028153709375',
      dateApply: 31,
      monthApply: '3/2025',
      dailyPercent: '-0.0077969363920551411191',
    },
  ];

  constructor({
    data,
    from,
    onePercentFromProRataDay,
    tax,
    updateTo,
    value,
  }: {
    data: LawImp[];
    from: string;
    updateTo: string;
    onePercentFromProRataDay: boolean;
    tax: number;
    value: number;
  }) {
    this.indexValues = data.map(values => ({
      ...values,
      inadata: moment(values.inadata).utc().format('YYYY-MM-DD 00:00:00'),
    }));
    this.from = moment(from, dateFormatEnum.DEFAULT);
    this.updateTo = moment(updateTo, dateFormatEnum.DEFAULT);
    this.onePercentFromProRataDay = onePercentFromProRataDay;
    this.tax = tax;
    this.value = value;

    this.fromDay = Number(this.from.format('DD'));
    this.dateFromOneDay = moment(this.from.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
    this.dateLawOneDay = moment(this.law.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
    this.updateToOneDay = moment(this.updateTo.clone().format(dateFormatEnum.ONE_DAY), dateFormatEnum.DEFAULT);
  }

  private isSameDate(date1: Moment, date2: Moment) {
    return date1.isSame(date2);
  }

  private addPeriod(period: PeriodImp) {
    this.periods.push(period);
  }

  private recalculate() {
    this.calculated = this.taxs.reduce((a, b) => a + b, 0);
  }

  private calculate() {
    this.recalculate();

    return {
      periods: this.periods,
      time: this.calculated,
      percentage: {
        savings: 0,
        pointFive: 0,
        selic: 0,
        one: 0,
      },
    };
  }

  protected formatNumber(number: number) {
    const text = String(number);
    const matches = text.match(/\d+\.\d{1,6}/);
    return matches ? matches[0] : number;
  }

  protected addTotalToPeriod(isLawPeriod: boolean = false) {
    this.recalculate();

    if (isLawPeriod) {
      const total = this.calculated - this.subtotal;
      if (!total) return;
      const fromDate = this.from.isSameOrAfter(this.law) ? this.from.clone() : this.law.clone();

      const lawPeriod = {
        from: fromDate.format(dateFormatEnum.DEFAULT),
        to: moment(this.updateTo, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        percentage: Number(this.formatNumber(total)),
        nomenclature: labelsEnum.PRO_RATA_LAW,
        calculated: this.formatNumber(total),
      };

      this.addPeriod(lawPeriod);
    }

    const total = {
      from: moment(this.from, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
      to: moment(this.updateTo, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
      percentage: Number(this.formatNumber(this.calculated)),
      nomenclature: `total do período`,
      calculated: this.formatNumber(this.calculated),
    };

    this.addPeriod(total);
  }

  private calculateProRata(date: Moment, days?: number, indexTax?: number, isLast?: boolean) {
    const percentage = new Decimal(this.tax);
    const dateDay = new Decimal(Number(date.format('DD')));
    const indexTaxDecimal = new Decimal(indexTax || 0);

    const daysInFromMonth = date.daysInMonth();
    const daysInFromMonthDiff = new Decimal(days || daysInFromMonth);

    const difference = daysInFromMonthDiff.minus(dateDay).plus(1);

    const taxByDayOfMonth = indexTax ? indexTaxDecimal : percentage.div(daysInFromMonth);
    const differenceUsed = isLast ? dateDay.minus(1) : difference;

    const proRata = differenceUsed.times(taxByDayOfMonth);

    this.taxs.push(Number(proRata.toString()));
    return proRata;
  }

  private addInterestToPeriod() {
    this.recalculate();
    this.subtotal = this.calculated;

    if (this.calculated) {
      const initialDate = this.from.clone();
      const endDate = this.updateTo.isSameOrAfter(this.law) ? this.law.clone() : this.updateTo.clone();

      const interestPeriod = {
        from: initialDate.format(dateFormatEnum.DEFAULT),
        to: endDate.format(dateFormatEnum.DEFAULT),
        percentage: Number(this.formatNumber(this.calculated)),
        nomenclature: `${this.tax.toFixed(4)} %`,
        calculated: this.formatNumber(this.calculated),
      };
      this.addPeriod(interestPeriod);
    }
  }

  private calculateInterest(dateStart: Moment, dateEnd: Moment) {
    if (dateStart.isSameOrAfter(dateEnd)) return;

    const time = getTimeByRange({
      start: dateStart.format(dateFormatEnum.ONE_DAY),
      end: dateEnd.format(dateFormatEnum.ONE_DAY),
      periodicity: 'month',
    });

    const tax = time * this.tax;
    this.taxs.push(tax);
  }

  public run() {
    this.beforeLaw();
    const lastIndex = this.indexValues[this.indexValues.length - 1];

    if (lastIndex && this.updateTo.isAfter(this.law)) {
      const lastDate = moment(lastIndex.monthApply, dateFormatEnum.MONTH_AND_YEAR).utc();

      if (
        moment(this.updateTo.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR).isAfter(
          moment(lastDate.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR)
        )
      )
        throw `Dados da 'Lei 14.905' disponíveis somente até ${lastDate
          .format(dateFormatEnum.MONTH_AND_YEAR_EXTENSE)
          .toUpperCase()}`;
    }

    if (this.updateTo.isSameOrBefore(this.law)) {
      this.addTotalToPeriod();
      return this.calculate();
    }

    this.bettweenLaw();

    if (this.updateTo.isSameOrBefore(moment('01/09/2024', dateFormatEnum.DEFAULT))) {
      this.addTotalToPeriod(true);
      return this.calculate();
    }

    const response = this.afterLaw();

    return response;
  }

  private beforeLaw() {
    const fromIsBeforeLaw = this.from.isBefore(this.law);
    const updateToIsBeforeLaw = this.updateTo.isBefore(this.law);

    const isSameMonth = this.from.month() == this.updateTo.month() && this.from.year() == this.updateTo.year();
    const hasDaysIfSameMonth = isSameMonth ? Number(this.updateTo.diff(this.from, 'days')) : undefined;
    const oneDayIfSameMonth = isSameMonth
      ? moment(this.from.format(dateFormatEnum.ONE_DAY), dateFormatEnum.ONE_DAY)
      : this.from;

    if (fromIsBeforeLaw && this.from.isBefore(this.dateLawOneDay) && this.onePercentFromProRataDay)
      this.calculateProRata(oneDayIfSameMonth, hasDaysIfSameMonth);

    if (fromIsBeforeLaw) {
      const initialDate = moment(
        this.onePercentFromProRataDay
          ? this.dateFromOneDay.clone().add(1, 'month').format(dateFormatEnum.ONE_DAY)
          : this.dateFromOneDay.clone().format(dateFormatEnum.ONE_DAY),
        dateFormatEnum.DEFAULT
      );

      if (this.onePercentFromProRataDay) {
        const endDate = updateToIsBeforeLaw ? this.updateTo.clone() : this.dateLawOneDay.clone();
        this.calculateInterest(initialDate, endDate);
      } else {
        const endDate = updateToIsBeforeLaw ? this.updateToOneDay.clone() : this.dateLawOneDay.clone();
        this.calculateInterest(initialDate, endDate);
      }
    }

    const one082024 = moment('01/08/2024', dateFormatEnum.DEFAULT);

    const isLastProRata =
      fromIsBeforeLaw &&
      this.updateTo.isBefore(one082024) &&
      this.onePercentFromProRataDay &&
      !this.updateToOneDay.isSame(this.dateFromOneDay);
    if (isLastProRata) this.calculateProRata(this.updateTo, undefined, undefined, isLastProRata);

    const proRata29Days = fromIsBeforeLaw && this.updateTo.isAfter(one082024);

    if (proRata29Days) {
      const day30 = 30;
      const isFromOrLaw = this.dateFromOneDay.isSame(this.dateLawOneDay) && this.fromDay < day30;
      const diaAgosto = isFromOrLaw ? this.from.clone() : this.dateLawOneDay;

      let restDays = day30 - 1;
      const updateToDay = Number(this.updateTo.format('DD')) - 1;

      if (updateToDay < restDays && this.updateTo.isSameOrBefore(this.law)) restDays = updateToDay;

      this.calculateProRata(diaAgosto, restDays);
    }

    this.addInterestToPeriod();
  }

  private bettweenLaw() {
    const dateLawPlusOneDay = this.law.clone().add(1, 'day');
    if (
      (dateLawPlusOneDay.isSameOrAfter(this.from) && dateLawPlusOneDay.isSameOrBefore(this.updateTo)) ||
      (this.law.isSameOrAfter(this.from) && this.law.isSameOrBefore(this.updateTo))
    ) {
      let diaAgosto = moment('02/08/2024', dateFormatEnum.DEFAULT);

      const indexTax = this.indexValues.find(values =>
        this.isSameDate(moment(values.inadata), moment('01/07/2024', dateFormatEnum.DEFAULT))
      )?.dailyPercent;

      if (
        this.updateTo.isAfter(moment('31/08/2024', dateFormatEnum.DEFAULT)) &&
        this.from.isSameOrBefore(moment('30/08/2024', dateFormatEnum.DEFAULT)) &&
        this.updateTo.diff(this.from, 'day') >= 2
      ) {
        diaAgosto = moment('01/08/2024', dateFormatEnum.DEFAULT);
      }

      this.calculateProRata(diaAgosto, 2, Number(indexTax));
    }
  }

  private afterLaw() {
    const monthType = 'month';

    const one092024 = moment('01/09/2024', dateFormatEnum.DEFAULT);

    const initialDate = this.from.isAfter(one092024) ? this.dateFromOneDay.clone() : one092024;

    const endDate = this.updateToOneDay.clone();

    for (let date = initialDate.clone(); date.isSameOrBefore(endDate); date.add(1, monthType)) {
      const index = this.indexValues.find(values =>
        this.isSameDate(moment(values.monthApply, dateFormatEnum.MONTH_AND_YEAR), date.clone())
      );

      const dailyPercent = new Decimal(Number(index?.dailyPercent || 0));
      const daysInMonth = new Decimal(Number(index?.dateApply || 0));

      const lastIteraction = date.isSame(endDate.clone());

      if (lastIteraction) {
        if (this.updateToOneDay.isSame(this.dateFromOneDay)) {
          const startDay = new Decimal(Number(this.from.clone().format('DD')));
          const endDay = new Decimal(Number(this.updateTo.clone().format('DD')));
          const difference = endDay.minus(startDay);
          const tax = Number(dailyPercent.times(difference).toString());
          if (tax > 0) this.taxs.push(tax);
        } else {
          const dayNumber = Number(this.updateTo.clone().format('DD'));
          const endDay = new Decimal(dayNumber - 1);
          const tax = Number(dailyPercent.times(endDay).toString());
          if (tax > 0) this.taxs.push(tax);
        }
      } else {
        const dateDay = new Decimal(
          Number(this.from.isAfter(one092024) ? this.from.clone().format('DD') : date.clone().format('DD'))
        );
        const difference = daysInMonth.minus(dateDay).plus(1);
        const tax = Number(dailyPercent.times(difference).toString());
        if (tax > 0) this.taxs.push(tax);
      }
    }

    this.addTotalToPeriod(true);
    this.calculate();
    return this.calculate();
  }
}
