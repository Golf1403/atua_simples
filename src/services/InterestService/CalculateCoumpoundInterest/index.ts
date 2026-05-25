import { TransitiveImp } from '../';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';

import CivilCodeInterest from '../../../enums/CivilCodeInterest';
import { transitiveInterestTypes } from '@data/calculations/civilCodeTypes';
import { getTimeByRange } from '../../../utils/getTimeByRange';
import { typePeriod } from '@data/calculations/interestTypes';

export default class CoupoundService {
  public transitive(interest: MonetaryInterestImp, time: number) {
    const calculate = (value: number) => value * interest.calculatedInfo.value;

    let interestResult = 0;
    switch (interest.civilCode) {
      case CivilCodeInterest.ADMINISTRATIVE_NATURE:
        interestResult = calculate(time / 100);
        break;
      case CivilCodeInterest.PUBLIC_EMPLOYEES:
        interestResult = calculate(time / 100);
        break;
      case CivilCodeInterest.SELECT_INDEX:
        interestResult = calculate(time / 100);
        break;
      case CivilCodeInterest.SAVINGS:
        interestResult = calculate(time / 100);
        break;
      case CivilCodeInterest.ONE_PERCENT:
        interestResult = calculate(time / 100);
        break;
    }

    return interestResult;
  }

  public coumpound(interest: MonetaryInterestImp, time: number) {
    const main = interest.calculatedInfo.value || 1;
    const capitalization = interest?.capitalization;
    const percentage = interest.onTransitiveInterest ? 1 / 100 : interest.percentage / 100;

    return this.formula(main < 0 ? 1 : main, percentage, time < 0 ? 0 : time, capitalization);
  }

  public calculate(interest: MonetaryInterestImp, transitive?: TransitiveImp) {
    const timeByRange = getTimeByRange({
      end: interest.dateEnd,
      periodicity: interest.periodicity,
      start: interest.dateStart,
    });

    let time = transitive ? transitive.time : timeByRange;

    if (interest.periodicity === typePeriod.id && !timeByRange) time = 1;

    const caseTransitive = transitiveInterestTypes.find(transitive => transitive == interest.civilCode);
    if (caseTransitive) {
      const interestResult = this.transitive(interest, time);
      return { interestResult, capitalizationPercentage: 0 };
    }

    const { interestResult, capitalizationPercentage } = this.coumpound(interest, time);
    return { interestResult, capitalizationPercentage };
  }

  private formula(principal: number, percentage: number, time: number, capitalization: string) {
    const capitalizationInterval = this.getCapitalization(capitalization);
    const capitalizationPerYear = 12 / capitalizationInterval;
    const proportionalRate = percentage / capitalizationPerYear;

    let equivalentRate = 0;
    if (capitalizationPerYear === 1) equivalentRate = percentage;
    else equivalentRate = Math.pow(1 + proportionalRate, capitalizationPerYear) - 1;

    const usePercentage = 1 + equivalentRate;
    const montante = principal * Math.pow(usePercentage, time);

    const capitalizationPercentage = montante / (principal || 1) - 1;

    return {
      interestResult: montante - principal,
      capitalizationPercentage: capitalizationPercentage < 0 ? 0 : capitalizationPercentage,
    };
  }

  private getCapitalization(capitalization: string) {
    const interestCapitalizationTypes: { [key: string]: number } = {
      none: 12,
      monthly: 12,
      bimonthly: 2,
      quarterly: 3,
      fourmonths: 4,
      semiannual: 6,
      yearly: 12,
    };
    return interestCapitalizationTypes[capitalization];
  }
}
