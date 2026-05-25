import BaseTransitive from '../BaseTransitive';
import { typeCompensatory, typeCompound, typeDefault } from '@data/calculations/interestTypes';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import moment from 'moment';
import { roundNumber } from '../../../utils/numberUtils';
import { poupancaNovaType, poupancaNovaWithSelicType } from '@data/calculations/poupancaTypes';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { formatPeriodPercentage, formatResult } from '@/services/InterestService/CalculateSimpleInterest';
import { savingsType } from '@/enums/SavingsType';
import CivilCodeInterest from '@/enums/CivilCodeInterest';

export const initialInterest: MonetaryInterestImp = {
  id: '',
  type: typeDefault.id,
  dateStart: moment(new Date()).add(-1, 'month').format(dateFormatEnum.DEFAULT),
  dateEnd: moment(new Date()).format(dateFormatEnum.DEFAULT),
  percentage: 1,
  index: '',
  formula: 'S',
  periodicity: 'month',
  capitalization: 'monthly',
  onInstallmentsValue: true,
  onDefaultInterest: false,
  onCompensatoryInterest: false,
  onCompoundInterest: false,
  onInterestPeriod: false,
  onInterestWithoutCorrection: false,
  onTransitiveInterest: false,
  calculated: 0.0,
  civilCodeDate: moment('10/01/2003', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureFirstDate: moment('31/12/2002', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureSecondDate: moment('30/06/2009', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  administrativeNatureThirdDate: moment('01/07/2009', dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
  poupancaType: savingsType.id,
  civilCode: CivilCodeInterest.NOT_APPLY,
  calculatedInfo: {
    periods: [],
    result: 0,
    value: 0,
    totalPercentage: 0,
    withoutTaxCorrection: false,
  },
};

export default class Savings extends BaseTransitive {
  private getPeriods(interest: MonetaryInterestImp, savings: number, percent: number, total: number) {
    const { dateStartInterest, dateEndInterest } = this.initializeInterest(interest);
    const periods = [];
    const dateNcc = moment('01/05/2012', dateFormatEnum.DEFAULT);

    if (percent)
      if (dateStartInterest.isSameOrBefore(dateNcc))
        if (dateEndInterest.isBefore(dateNcc))
          periods.push({
            from: dateStartInterest.format(dateFormatEnum.DEFAULT),
            to: dateEndInterest.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(percent),
            nomenclature: `${interest.percentage} %`,
            calculated: formatResult(percent),
          });
        else
          periods.push({
            from: dateStartInterest.format(dateFormatEnum.DEFAULT),
            to: dateNcc.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(percent),
            nomenclature: `${interest.percentage} %`,
            calculated: formatResult(percent),
          });

    if (savings)
      if (dateEndInterest.isSameOrAfter(dateNcc))
        if (dateStartInterest.isAfter(dateNcc))
          periods.push({
            from: dateStartInterest.format(dateFormatEnum.DEFAULT),
            to: dateEndInterest.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(savings),
            nomenclature: poupancaNovaWithSelicType.label.toLocaleLowerCase(),
            calculated: formatResult(savings),
          });
        else
          periods.push({
            from: dateNcc.format(dateFormatEnum.DEFAULT),
            to: dateEndInterest.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(savings),
            nomenclature: poupancaNovaWithSelicType.label.toLocaleLowerCase(),
            calculated: formatResult(savings),
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

  private calculateByProRata(
    interest: MonetaryInterestImp,
    dateStartInterest: moment.Moment,
    dateEndInterest: moment.Moment,
    dateNcc: moment.Moment,
    savingsPercentage: number,
    capitalizedSavings: number,
    proRataDay?: boolean
  ) {
    let time = 0;
    let interestPercentage = 0;

    switch (interest.type) {
      case typeDefault.value: {
        if (dateEndInterest.isBefore(dateNcc))
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
            proRataDay,
          });
        else
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateNcc.format(dateFormatEnum.DEFAULT),
            },
            proRataDay,
          });

        if (dateStartInterest.isSame(dateNcc)) {
          interestPercentage = 0;
        }

        if (dateStartInterest.isSame(dateEndInterest)) {
          savingsPercentage = 0;
          interestPercentage = 0;
        }

        if (savingsPercentage < 0) savingsPercentage = 0;
        time = interestPercentage + savingsPercentage;

        const { periods } = this.getPeriods(interest, savingsPercentage, interestPercentage, time);

        return {
          periods,
          time,
          percentage: {
            savings: roundNumber(savingsPercentage),
            pointFive: 0,
            selic: 0,
            one: 0,
          },
        };
      }

      case typeCompensatory.value: {
        if (dateEndInterest.isBefore(dateNcc))
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
            proRataDay,
          });
        else
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateNcc.format(dateFormatEnum.DEFAULT),
            },
            proRataDay,
          });

        if (dateStartInterest.isSame(dateEndInterest)) {
          savingsPercentage = 0;
          interestPercentage = 0;
        }

        if (savingsPercentage < 0) savingsPercentage = 0;

        time = interestPercentage + savingsPercentage;
        const { periods } = this.getPeriods(interest, savingsPercentage, interestPercentage, time);

        return {
          periods,
          time,
          percentage: {
            savings: roundNumber(savingsPercentage),
            pointFive: 0,
            selic: 0,
            one: 0,
          },
        };
      }

      case typeCompound.value: {
        if (dateEndInterest.isBefore(dateNcc))
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              type: typeCompound.id,
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
            },
          });
        else
          interestPercentage = this.calculateInterest({
            interest: {
              ...initialInterest,
              calculatedInfo: {
                ...initialInterest.calculatedInfo,
                value: interest.calculatedInfo.value,
              },
              type: typeCompound.id,
              percentage: interest.percentage,
              dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
              dateEnd: dateNcc.format(dateFormatEnum.DEFAULT),
            },
          });

        if (dateStartInterest.isSame(dateEndInterest)) {
          savingsPercentage = 0;
          interestPercentage = 0;
        }

        capitalizedSavings = (capitalizedSavings - 1) * 100;
        if (capitalizedSavings < 0) capitalizedSavings = 0;

        time = interestPercentage + capitalizedSavings;

        const { periods } = this.getPeriods(interest, capitalizedSavings, interestPercentage, time);
        return {
          periods,
          time,
          percentage: {
            savings: roundNumber(capitalizedSavings),
            pointFive: 0,
            selic: 0,
            one: 0,
          },
        };
      }
    }
  }

  public run(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp, proRataDay?: boolean) {
    const { dateEndInterest, dateStartInterest, dateEndInterestOneDay, dateStartInterestOneDay } =
      this.initializeInterest(interest);

    const lastIndex =
      interest.poupancaType == poupancaNovaType.id
        ? interestIndexes.newSavings[interestIndexes.newSavings.length - 1]
        : interestIndexes.savings[interestIndexes.savings.length - 1];

    if (lastIndex) {
      const lastDate = moment(lastIndex.date).utc();

      if (
        moment(dateEndInterest.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR).isAfter(
          moment(lastDate.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR)
        )
      )
        throw `Dados da 'POUPANÇA' disponíveis somente até ${lastDate
          .format(dateFormatEnum.MONTH_AND_YEAR_EXTENSE)
          .toUpperCase()}`;
    }

    const initialInterestIndexes: InterestIndexesImp = {
      selic: [],
      savings: [],
      tr: [],
      newSavings: [],
      newSavingsDaily: [],
    };

    const result = interestIndexes || initialInterestIndexes;

    let savingsPercentage = 0;
    let capitalizedSavings = 0;

    const newSavingsList = [];
    const trList = [];
    const dateStartIsSameDateEnd = dateStartInterestOneDay.isSame(dateEndInterestOneDay);

    const dateNcc = moment('01/05/2012', dateFormatEnum.DEFAULT);

    for (const newSaving of result.newSavings) {
      const newSavingsDate = moment(newSaving.date, 'YYYY-MM-DD');

      if (
        newSavingsDate[proRataDay ? 'isSameOrBefore' : 'isBefore'](dateEndInterestOneDay) &&
        newSavingsDate.isSameOrAfter(dateNcc) &&
        newSavingsDate.isSameOrAfter(dateStartInterestOneDay)
      )
        newSavingsList.push(newSaving);
    }
    for (const tr of result.tr) {
      const trDate = moment(tr.date, 'YYYY-MM-DD');
      if (
        trDate.isSameOrAfter(dateNcc) &&
        trDate.isSameOrAfter(dateStartInterestOneDay) &&
        trDate[proRataDay ? 'isSameOrBefore' : 'isBefore'](dateEndInterestOneDay)
      )
        trList.push(tr);
    }

    let trIndex = 0;
    for (let i = 0; i < newSavingsList.length; i++) {
      const savingPercentage = Number(newSavingsList[i].percentual) / 100;
      const dateSaving = moment(newSavingsList[i].date, 'YYYY-MM-DD');
      const tr = trList[trIndex];
      if (tr) {
        const dateTr = moment(tr.date, 'YYYY-MM-DD');
        const trPercentage = Number(tr.percentual) / 100;
        const isSameDate = dateTr.isSame(dateSaving);

        if (isSameDate) {
          const roundFourDecimalCase = 10000;
          const percentageTotal = ((savingPercentage + 1) / (trPercentage + 1) - 1) * 100;
          const diff = Math.round(percentageTotal * roundFourDecimalCase) / roundFourDecimalCase;
          const dateTrIsSamedateStartInterest = dateStartInterestOneDay.isSame(dateTr);
          const dateTrIsSamedateEndInterest = dateEndInterestOneDay.isSame(dateTr);

          if ((dateTrIsSamedateStartInterest && dateStartIsSameDateEnd) || dateTrIsSamedateEndInterest) {
            const day = Number(dateEndInterest.format('DD'));
            const daysInMonth = dateEndInterest.daysInMonth();
            savingsPercentage += (day - 1) * (diff / daysInMonth);
          } else if (proRataDay && dateTrIsSamedateStartInterest) {
            const day = Number(dateStartInterest.format('DD'));
            const daysInMonth = dateStartInterestOneDay.daysInMonth();
            const diffOfDays = daysInMonth - day + 1;
            savingsPercentage += diffOfDays * (diff / daysInMonth);
          } else {
            savingsPercentage += diff;
          }

          const diffPercentage = diff / 100;
          const diffPercentagePlusOne = diffPercentage + 1;

          if (capitalizedSavings) capitalizedSavings = capitalizedSavings * diffPercentagePlusOne;
          else capitalizedSavings = diff ? diffPercentagePlusOne : capitalizedSavings;

          trIndex++;
        }
        if (trIndex === trList.length) break;
      }
    }

    return proRataDay
      ? this.calculateByProRata(
          interest,
          dateStartInterest,
          dateEndInterest,
          dateNcc,
          savingsPercentage,
          capitalizedSavings,
          proRataDay
        )
      : this.calculateByProRata(
          interest,
          dateStartInterestOneDay,
          dateEndInterestOneDay,
          dateNcc,
          savingsPercentage,
          capitalizedSavings,
          proRataDay
        );
  }
}
