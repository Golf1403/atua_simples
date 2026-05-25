import { typeCompensatory, typeCompound, typeDefault } from '@data/calculations/interestTypes';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import BaseTransitive from '../BaseTransitive';
import moment from 'moment';
import { initialInterest } from '@services/TransitiveInterestService/Savings';
import { roundNumber } from '../../../utils/numberUtils';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { formatPeriodPercentage, formatResult } from '@/services/InterestService/CalculateSimpleInterest';
import { frequencyDayDaily } from '@/data/calculations/frequencyDaysTypes';

export default class OnePercent extends BaseTransitive {
  private getOnePerPeriods(interest: MonetaryInterestImp, onePercent: number, percent: number, total: number) {
    const { dateStartInterest, dateEndInterest, civilCodeDate } = this.initializeInterest(interest);
    const periods = [];

    if (percent)
      if (dateStartInterest.isBefore(dateEndInterest))
        if (dateStartInterest.isBefore(civilCodeDate))
          if (civilCodeDate.isBefore(dateEndInterest))
            periods.push({
              from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
              to: moment(civilCodeDate).format(dateFormatEnum.DEFAULT),
              percentage: formatPeriodPercentage(percent),
              nomenclature: `${formatPeriodPercentage(interest.percentage)} %`,
              calculated: formatResult(percent),
            });
          else
            periods.push({
              from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
              to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
              percentage: formatPeriodPercentage(percent),
              nomenclature: `${formatPeriodPercentage(interest.percentage)} %`,
              calculated: formatResult(percent),
            });

    if (onePercent)
      if (dateStartInterest.isBefore(dateEndInterest))
        if (dateStartInterest.isAfter(civilCodeDate))
          if (civilCodeDate.isAfter(dateStartInterest))
            periods.push({
              from: moment(civilCodeDate).format(dateFormatEnum.DEFAULT),
              to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
              percentage: formatPeriodPercentage(onePercent),
              nomenclature: `1 %`,
              calculated: formatResult(onePercent),
            });
          else
            periods.push({
              from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
              to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
              percentage: formatPeriodPercentage(onePercent),
              nomenclature: `1 %`,
              calculated: formatResult(onePercent),
            });
        else
          periods.push({
            from: moment(civilCodeDate).format(dateFormatEnum.DEFAULT),
            to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(onePercent),
            nomenclature: `1 %`,
            calculated: formatResult(onePercent),
          });

    if (total)
      periods.push({
        from: dateStartInterest.format(dateFormatEnum.DEFAULT),
        to: dateEndInterest.format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(total),
        nomenclature: 'total do período',
        calculated: formatResult(total),
      });

    return { periods };
  }

  private compound(interest: MonetaryInterestImp) {
    const { dateStartInterest, dateStartInterestOneDay, dateEndInterestOneDay, dateEndInterest, civilCodeDate } =
      this.initializeInterest(interest);

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      type: typeCompound.id,
      dateStart: civilCodeDate.format(dateFormatEnum.DEFAULT),
      dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
      percentage: interest.percentage,
      periodicity: interest.periodicity,
      calculatedInfo: { ...interest.calculatedInfo, value: 1 },
    };

    let interestPercent = 0;
    let onePercent = 0;

    if (dateStartInterest.isBefore(dateEndInterest))
      if (dateStartInterest.isBefore(civilCodeDate))
        if (civilCodeDate.isBefore(dateEndInterest))
          interestPercent = this.calculateInterest({
            interest: {
              ...currentInterest,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: civilCodeDate.format(dateFormatEnum.DEFAULT),
            },
            composition: true,
          });
        else
          interestPercent = this.calculateInterest({
            interest: {
              ...currentInterest,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
          });

    if (dateStartInterest.isBefore(dateEndInterest))
      if (dateStartInterest.isAfter(civilCodeDate)) {
        if (civilCodeDate.isAfter(dateStartInterest))
          onePercent = this.calculateInterest({
            interest: {
              ...currentInterest,
              percentage: 1,
              dateStart: civilCodeDate.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
            composition: true,
          });
        else
          onePercent = this.calculateInterest({
            interest: {
              ...currentInterest,
              percentage: 1,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
          });
      } else
        onePercent = this.calculateInterest({
          interest: {
            ...currentInterest,
            percentage: 1,
            dateStart: civilCodeDate.format(dateFormatEnum.DEFAULT),
            dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
          },
        });

    const time = ((interestPercent / 100 + 1) * (onePercent / 100 + 1) - 1) * 100;

    const { periods } = this.getOnePerPeriods(interest, onePercent, interestPercent, time);

    return {
      time,
      percentage: {
        savings: 0,
        selic: 0,
        pointFive: roundNumber(interestPercent),
        one: roundNumber(onePercent),
      },
      periods,
    };
  }

  private getOneAndInterestPercent(
    currentInterest: MonetaryInterestImp,
    dateStartInterest: moment.Moment,
    dateEndInterest: moment.Moment,
    civilCodeDate: moment.Moment,
    proRataDay?: boolean
  ) {
    let interestPercent = 0;
    let onePercent = 0;

    if (dateStartInterest.isBefore(civilCodeDate))
      if (civilCodeDate.isBefore(dateEndInterest))
        interestPercent = this.calculateInterest({
          interest: {
            ...currentInterest,
            dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
            dateEnd: civilCodeDate.format(dateFormatEnum.DEFAULT),
          },
          proRataDay,
          composition: true,
        });
      else
        interestPercent = this.calculateInterest({
          interest: {
            ...currentInterest,
            dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
            dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
          },
          proRataDay,
        });

    if (dateEndInterest.isSameOrAfter(civilCodeDate)) {
      if (civilCodeDate.isAfter(dateStartInterest))
        onePercent = this.calculateInterest({
          interest: {
            ...currentInterest,
            percentage: 1,
            dateStart: civilCodeDate.format(dateFormatEnum.DEFAULT),
            dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
          },
          proRataDay,
          composition: true,
        });
      else
        onePercent = this.calculateInterest({
          interest: {
            ...currentInterest,
            percentage: 1,
            dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
            dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
          },
          proRataDay,
        });
    }

    return { onePercent, interestPercent };
  }

  private simple(interest: MonetaryInterestImp, proRataDay?: boolean) {
    const {
      dateStartInterestOneDay,
      dateEndInterestOneDay,
      civilCodeDateOneDay,
      dateStartInterest,
      dateEndInterest,
      civilCodeDate,
    } = this.initializeInterest(interest);

    let time = 0;

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      dateStart: civilCodeDateOneDay.format(
        interest.periodicity == frequencyDayDaily.value ? dateFormatEnum.DEFAULT : dateFormatEnum.ONE_DAY
      ),
      dateEnd: dateEndInterestOneDay.format(dateFormatEnum.DEFAULT),
      percentage: interest.percentage,
      periodicity: interest.periodicity,
      calculatedInfo: { ...interest.calculatedInfo, value: 1 },
    };

    const { interestPercent, onePercent } = proRataDay
      ? this.getOneAndInterestPercent(currentInterest, dateStartInterest, dateEndInterest, civilCodeDate, proRataDay)
      : this.getOneAndInterestPercent(
          currentInterest,
          dateStartInterestOneDay,
          dateEndInterestOneDay,
          civilCodeDateOneDay,
          proRataDay
        );
    time += interestPercent;
    time += onePercent;

    const { periods } = this.getOnePerPeriods(interest, onePercent, interestPercent, time);

    return {
      time,
      percentage: {
        savings: 0,
        selic: 0,
        pointFive: roundNumber(interestPercent),
        one: roundNumber(onePercent),
      },
      periods,
    };
  }

  public run(interest: MonetaryInterestImp, proRataDay?: boolean) {
    try {
      switch (interest.type) {
        case typeDefault.value:
          return this.simple(interest, proRataDay);
        case typeCompensatory.value:
          return this.simple(interest, proRataDay);
        case typeCompound.value:
          return this.compound(interest);
      }
    } catch (error) {
      throw error;
    }
  }
}
