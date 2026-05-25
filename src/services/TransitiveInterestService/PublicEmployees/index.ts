import BaseTransitive, { ICalculatedCounpondInterest } from '../BaseTransitive';
import { typeCompensatory, typeCompound, typeDefault } from '@data/calculations/interestTypes';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import moment from 'moment';
import { roundNumber } from '../../../utils/numberUtils';
import { translateNomenclatureInterest } from '../../../utils/interestCivilCodeHelper';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { formatPeriodPercentage, formatResult } from '@/services/InterestService/CalculateSimpleInterest';
import { initialInterest } from '@services/TransitiveInterestService/Savings';
import { poupancaNovaType } from '@/data/calculations/poupancaTypes';
export default class PublicEmployees extends BaseTransitive {
  private getPubEmpPeriods(
    interest: MonetaryInterestImp,
    onePercent: number,
    meddlePercent: number,
    savings: number,
    total: number
  ) {
    const {
      dateStartInterest,
      administrativeNatureThirdDate,
      administrativeNatureSecondDate,
      administrativeNatureFirstDate,
      dateEndInterest,
    } = this.initializeInterest(interest);

    const periods = [];

    if (onePercent > 0)
      periods.push({
        from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
        to: (administrativeNatureFirstDate.isSameOrAfter(dateEndInterest)
          ? dateEndInterest
          : administrativeNatureFirstDate
        ).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(onePercent),
        nomenclature: `1 %`,
        calculated: formatResult(onePercent),
      });

    if (meddlePercent > 0)
      if (administrativeNatureFirstDate.isBefore(dateStartInterest))
        periods.push({
          from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
          to: (administrativeNatureSecondDate.isSameOrAfter(dateEndInterest)
            ? dateEndInterest
            : administrativeNatureSecondDate
          ).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(meddlePercent),
          nomenclature: '0.5 %',
          calculated: formatResult(meddlePercent),
        });
      else
        periods.push({
          from: moment(administrativeNatureFirstDate).add(1, 'days').format(dateFormatEnum.DEFAULT),
          to: (administrativeNatureSecondDate.isSameOrAfter(dateEndInterest)
            ? dateEndInterest
            : administrativeNatureSecondDate
          ).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(meddlePercent),
          nomenclature: '0.5 %',
          calculated: formatResult(meddlePercent),
        });

    if (dateEndInterest.isSameOrAfter(administrativeNatureThirdDate))
      if (savings)
        if (dateStartInterest.isAfter(administrativeNatureThirdDate))
          periods.push({
            from: dateStartInterest.format(dateFormatEnum.DEFAULT),
            to: dateEndInterest.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(savings),
            nomenclature: translateNomenclatureInterest(interest.poupancaType),
            calculated: formatResult(savings),
          });
        else
          periods.push({
            from: administrativeNatureThirdDate.format(dateFormatEnum.DEFAULT),
            to: dateEndInterest.format(dateFormatEnum.DEFAULT),
            percentage: formatPeriodPercentage(savings),
            nomenclature: translateNomenclatureInterest(interest.poupancaType),
            calculated: formatResult(savings),
          });

    if (total)
      periods.push({
        from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
        to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(total),
        nomenclature: 'total do período',
        calculated: formatResult(total),
      });

    return { periods };
  }

  private compound(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp) {
    const {
      dateStartInterest,
      dateEndInterest,
      administrativeNatureFirstDate,
      administrativeNatureSecondDate,
      dateStartInterestOneDay,
      dateEndInterestOneDay,
      administrativeNatureFirstDateOneDay,
      administrativeNatureSecondDateOneDay,
    } = this.initializeInterest(interest);

    const { capitalizedSavings: _capitalizedSavings } = this.capitalizedIndexes(interest, interestIndexes);

    let onePercent = 0;

    const capitalizedSavings = _capitalizedSavings || 0;

    let time = 0;
    let meddlePercent = 0;

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      type: typeCompound.id,
      dateStart: moment(dateStartInterest, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
      dateEnd: administrativeNatureFirstDateOneDay.format(dateFormatEnum.DEFAULT),
      onInstallmentsValue: true,
      capitalization: interest.capitalization,
      calculatedInfo: interest.calculatedInfo,
      periodicity: interest.periodicity,
    };

    const params: ICalculatedCounpondInterest = {
      interest: currentInterest,
      transitive: undefined,
    };

    if (dateEndInterest.isBefore(administrativeNatureFirstDate)) {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = dateEndInterest.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 1;
    } else if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest)) {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = administrativeNatureFirstDateOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 1;
    }

    onePercent = this.calculateInterest(params);

    if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest)) {
      if (administrativeNatureSecondDate.isSameOrBefore(dateEndInterest)) {
        params.interest.dateStart = administrativeNatureFirstDateOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.dateEnd = administrativeNatureSecondDateOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.percentage = 0.5;
      } else {
        params.interest.dateStart = administrativeNatureFirstDateOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.dateEnd = dateEndInterestOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.percentage = 0.5;
      }
    } else if (administrativeNatureSecondDate.isSameOrBefore(dateEndInterest)) {
      params.interest.dateStart = dateStartInterestOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = administrativeNatureSecondDateOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 0.5;
    } else {
      params.interest.dateStart = dateStartInterestOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = dateEndInterestOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 0.5;
    }

    meddlePercent = this.calculateInterest(params);

    time =
      ((onePercent > 0 ? onePercent / 100 + 1 : 1) *
        (capitalizedSavings > 0 ? capitalizedSavings / 100 + 1 : 1) *
        (meddlePercent > 0 ? meddlePercent / 100 + 1 : 1) -
        1) *
      100;

    const { periods } = this.getPubEmpPeriods(interest, onePercent, meddlePercent, capitalizedSavings, time);

    return {
      time,
      percentage: {
        savings: roundNumber(capitalizedSavings),
        selic: 0,
        pointFive: roundNumber(meddlePercent),
        one: roundNumber(onePercent),
      },
      periods,
    };
  }

  private simple(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp, proRataDay?: boolean) {
    let accumulatedMonth = 0;

    const {
      dateStartInterest,
      dateEndInterest,
      administrativeNatureFirstDate,
      administrativeNatureSecondDate,
      administrativeNatureSecondDateAddOneDay,
      administrativeNatureFirstDateAddOneDay,
    } = this.initializeInterest(interest);
    const { accumulatedSavings } = this.accumulatedIndexes(interest, interestIndexes, undefined, proRataDay);

    let meddlePercent = 0;
    let onePercent = 0;

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      dateStart: moment(dateStartInterest, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
      dateEnd: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
      onInstallmentsValue: true,
      capitalization: interest.capitalization,
      calculatedInfo: interest.calculatedInfo,
      periodicity: interest.periodicity,
    };

    const params: ICalculatedCounpondInterest = {
      interest: currentInterest,
      transitive: undefined,
      proRataDay,
    };

    if (dateEndInterest.isBefore(administrativeNatureFirstDate)) {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = dateEndInterest.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 1;
    } else if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest)) {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 1;
    }

    onePercent = this.calculateInterest(params);

    if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest)) {
      if (administrativeNatureSecondDate.isSameOrBefore(dateEndInterest)) {
        params.interest.dateStart = administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.dateEnd = administrativeNatureSecondDateAddOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.percentage = 0.5;
      } else {
        params.interest.dateStart = administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT);
        params.interest.dateEnd = dateEndInterest.format(dateFormatEnum.DEFAULT);
        params.interest.percentage = 0.5;
      }
    } else if (administrativeNatureSecondDate.isSameOrBefore(dateEndInterest)) {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = administrativeNatureSecondDateAddOneDay.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 0.5;
    } else {
      params.interest.dateStart = dateStartInterest.format(dateFormatEnum.DEFAULT);
      params.interest.dateEnd = dateEndInterest.format(dateFormatEnum.DEFAULT);
      params.interest.percentage = 0.5;
    }

    meddlePercent = this.calculateInterest(params);

    if (onePercent > 0) accumulatedMonth += onePercent;

    if (meddlePercent > 0) accumulatedMonth += meddlePercent;

    const time = Number(
      (Number(accumulatedMonth.toPrecision(6)) + Number(accumulatedSavings.toPrecision(6))).toFixed(6)
    );
    const { periods } = this.getPubEmpPeriods(interest, onePercent, meddlePercent, accumulatedSavings, time);

    return {
      time,
      percentage: {
        savings: roundNumber(accumulatedSavings),
        selic: 0,
        pointFive: roundNumber(meddlePercent),
        one: roundNumber(onePercent),
      },
      periods,
    };
  }

  public run(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp, proRataDay?: boolean) {
    const lastIndex =
      interest.poupancaType == poupancaNovaType.id
        ? interestIndexes.newSavings[interestIndexes.newSavings.length - 1]
        : interestIndexes.savings[interestIndexes.savings.length - 1];

    const dateEnd = moment(interest.dateEnd, dateFormatEnum.DEFAULT);
    if (lastIndex) {
      const lastDate = moment(lastIndex.date).utc();

      if (
        moment(dateEnd.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR).isAfter(
          moment(lastDate.format(dateFormatEnum.MONTH_AND_YEAR), dateFormatEnum.MONTH_AND_YEAR)
        )
      )
        throw `Dados dos 'SERVIDORES E EMPREGADOS PÚBLICOS' disponíveis somente até ${lastDate
          .format(dateFormatEnum.MONTH_AND_YEAR_EXTENSE)
          .toUpperCase()}`;
    }

    switch (interest.type) {
      case typeDefault.id:
        return this.simple(interest, interestIndexes, proRataDay);
      case typeCompensatory.id:
        return this.simple(interest, interestIndexes, proRataDay);
      case typeCompound.id:
        return this.compound(interest, interestIndexes);
    }
  }
}
