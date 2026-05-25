import BaseTransitive from '../BaseTransitive';
import { typeCompensatory, typeCompound, typeDefault } from '@data/calculations/interestTypes';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import moment from 'moment';
import { roundNumber } from '../../../utils/numberUtils';
import { initialInterest } from '@services/TransitiveInterestService/Savings';
import { translateNomenclatureInterest } from '../../../utils/interestCivilCodeHelper';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { formatPeriodPercentage, formatResult } from '@/services/InterestService/CalculateSimpleInterest';
import { selicEnum } from '@/data/calculations/indexTypes';
import { poupancaNovaType } from '@/data/calculations/poupancaTypes';

export default class AdministrativeNature extends BaseTransitive {
  private getNatAdmPeriods(
    interest: MonetaryInterestImp,
    month: number,
    selic: number,
    savings: number,
    total: number
  ) {
    const {
      dateStartInterest,
      administrativeNatureThirdDate,
      administrativeNatureSecondDate,
      administrativeNatureSecondDateAddOneDay,
      administrativeNatureFirstDate,
      administrativeNatureFirstDateAddOneDay,
      dateEndInterest,
    } = this.initializeInterest(interest);

    const periods = [];

    if (month)
      if (administrativeNatureFirstDate.isBefore(dateEndInterest))
        periods.push({
          from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
          to: moment(administrativeNatureFirstDateAddOneDay).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(month),
          nomenclature: `0.5 %`,
          calculated: formatResult(month),
        });
      else
        periods.push({
          from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
          to: moment(dateEndInterest).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(month),
          nomenclature: `0.5 %`,
          calculated: formatResult(month),
        });

    if (selic)
      if (administrativeNatureFirstDate.isBefore(dateStartInterest))
        periods.push({
          from: moment(dateStartInterest).format(dateFormatEnum.DEFAULT),
          to: (administrativeNatureThirdDate.isSameOrAfter(dateEndInterest)
            ? dateEndInterest
            : administrativeNatureSecondDate
          ).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(selic),
          nomenclature: selicEnum.name,
          calculated: formatResult(selic),
        });
      else
        periods.push({
          from: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
          to: (administrativeNatureThirdDate.isSameOrAfter(dateEndInterest)
            ? dateEndInterest
            : administrativeNatureSecondDateAddOneDay
          ).format(dateFormatEnum.DEFAULT),
          percentage: formatPeriodPercentage(selic),
          nomenclature: selicEnum.name,
          calculated: formatResult(selic),
        });

    if (savings)
      if (dateEndInterest.isSameOrAfter(administrativeNatureThirdDate))
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
        from: moment(interest.dateStart, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        to: moment(interest.dateEnd, dateFormatEnum.DEFAULT).format(dateFormatEnum.DEFAULT),
        percentage: formatPeriodPercentage(total),
        nomenclature: 'total do período',
        calculated: formatResult(total),
      });

    return { periods };
  }
  private simple(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp, proRataDay?: boolean) {
    const {
      administrativeNatureFirstDateAddOneDay,
      administrativeNatureFirstDate,
      dateStartInterest,
      dateEndInterest,
    } = this.initializeInterest(interest);

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
        throw `Dados da 'NATUREZA ADMINISTRATIVA' disponíveis somente até ${lastDate
          .format(dateFormatEnum.MONTH_AND_YEAR_EXTENSE)
          .toUpperCase()}`;
    }

    const { accumulatedSavings, accumulatedSelic } = this.accumulatedIndexes(
      interest,
      interestIndexes,
      undefined,
      proRataDay
    );

    let time = 0;
    const savings = accumulatedSavings || 0;
    const selic = accumulatedSelic || 0;
    let meddlePercentage = 0;

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      percentage: 0.5,
      dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
      dateEnd: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
      onInstallmentsValue: true,
      calculatedInfo: { ...interest.calculatedInfo, value: 1 },
    };

    if (dateEndInterest.isBefore(administrativeNatureFirstDate)) {
      meddlePercentage = this.calculateInterest({
        interest: {
          ...currentInterest,
          dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
          dateEnd: dateEndInterest.format(dateFormatEnum.DEFAULT),
        },
        proRataDay,
      });
    } else if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest)) {
      meddlePercentage = this.calculateInterest({
        interest: {
          ...currentInterest,
          dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
          dateEnd: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
        },
        proRataDay,
      });
    }

    time = Number((Number(meddlePercentage) + Number(selic) + Number(savings)).toFixed(6));

    const { periods } = this.getNatAdmPeriods(interest, meddlePercentage, selic, savings, time);

    return {
      time,
      percentage: {
        savings: roundNumber(savings),
        selic: roundNumber(selic),
        pointFive: roundNumber(meddlePercentage),
        one: 0,
      },
      periods,
    };
  }
  private compound(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp) {
    const {
      dateStartInterestOneDay,
      administrativeNatureFirstDateAddOneDay,
      administrativeNatureFirstDate,
      dateStartInterest,
      dateEndInterest,
      dateEndInterestOneDay,
    } = this.initializeInterest(interest);

    const { capitalizedSelic: capitalizedSelicResponse, capitalizedSavings: capitalizedSavingsResponse } =
      this.capitalizedIndexes(interest, interestIndexes);

    const capitalizedSelic = capitalizedSelicResponse || 0;
    const capitalizedSavings = capitalizedSavingsResponse || 0;

    let time = 0;

    const currentInterest: MonetaryInterestImp = {
      ...initialInterest,
      type: typeCompound.id,
      percentage: 0.5,
      dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
      dateEnd: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
      onInstallmentsValue: true,
      calculatedInfo: { ...interest.calculatedInfo, value: 1 },
    };

    let meddlePercentage = 0;

    if (dateEndInterest.isBefore(administrativeNatureFirstDate)) {
      meddlePercentage = this.calculateInterest({
        interest: {
          ...currentInterest,
          dateStart: dateStartInterest.format(dateFormatEnum.DEFAULT),
          dateEnd: dateEndInterestOneDay.format(dateFormatEnum.DEFAULT),
        },
      });
    } else if (administrativeNatureFirstDate.isSameOrAfter(dateStartInterest))
      meddlePercentage = this.calculateInterest({
        interest: {
          ...currentInterest,
          dateStart: dateStartInterestOneDay.format(dateFormatEnum.DEFAULT),
          dateEnd: administrativeNatureFirstDateAddOneDay.format(dateFormatEnum.DEFAULT),
        },
      });

    const notShouldBeZero = 1;

    time =
      ((capitalizedSelic ? capitalizedSelic / 100 + notShouldBeZero : 1) *
        (capitalizedSavings ? capitalizedSavings / 100 + notShouldBeZero : 1) *
        (meddlePercentage ? meddlePercentage / 100 + notShouldBeZero : 1) -
        1) *
      100;

    const { periods } = this.getNatAdmPeriods(interest, meddlePercentage, capitalizedSelic, capitalizedSavings, time);

    return {
      time,
      percentage: {
        savings: roundNumber(capitalizedSavings),
        selic: roundNumber(capitalizedSelic),
        pointFive: roundNumber(meddlePercentage),
        one: 0,
      },
      periods,
    };
  }
  public run(interest: MonetaryInterestImp, interestIndexes: InterestIndexesImp, proRataDay?: boolean) {
    switch (interest.type) {
      case typeDefault.value:
        return this.simple(interest, interestIndexes, proRataDay);
      case typeCompensatory.value:
        return this.simple(interest, interestIndexes, proRataDay);
      case typeCompound.value:
        return this.compound(interest, interestIndexes);
    }
  }
}
