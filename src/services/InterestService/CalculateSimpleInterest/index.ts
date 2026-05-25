import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import { TransitiveImp } from '../';

import { transitiveInterestTypes } from '@data/calculations/civilCodeTypes';
import { getTimeByRange } from '../../../utils/getTimeByRange';
import { typePeriod } from '@data/calculations/interestTypes';
import MonetaryFineImp from '@interfaces/calculations/MonetaryFineImp';
import { fineAmountType, finePercentageType } from '@data/calculations/fineEntryTypes';
import { doConversion } from '@/utils/conversionHelper';

export const formatPeriodPercentage = (value: number) => {
  const text = String(value);
  const matches = text.match(/\d+\.\d{1,6}/);
  return Number(matches ? matches[0] : value);
};

export const formatResult = (value: number) => {
  return formatPeriodPercentage(value);
};
export default class SimpleService {
  public calculate(interest: MonetaryInterestImp | MonetaryFineImp, transitive?: TransitiveImp) {
    const timeByRange = getTimeByRange({
      end: interest.dateEnd,
      periodicity: interest.periodicity,
      start: interest.dateStart,
    });

    let time = transitive ? transitive.time : timeByRange;

    if (interest.periodicity === typePeriod.id) time = 1;

    const value = interest.calculatedInfo.value;
    let interestResult = 0;

    const currentFine = interest as MonetaryFineImp;
    const currentInterest = interest as MonetaryInterestImp;

    const caseTransitive = transitiveInterestTypes.find(transitive => transitive == currentInterest?.civilCode);

    if (caseTransitive) {
      const calculateTransitiveCase = () => {
        const hasPeriods = transitive && transitive.periods.length > 1;
        if (hasPeriods)
          transitive?.periods.forEach(
            (period, index) =>
              (interestResult +=
                index != transitive?.periods.length - 1 ? Math.round((period.percentage / 100) * value * 100) / 100 : 0)
          );
        else interestResult = value * (time / 100);

        return { interestResult };
      };

      return calculateTransitiveCase();
    }

    switch (currentFine.type) {
      case fineAmountType.id: {
        interestResult = currentFine.percentage * time;
        interestResult = doConversion(interestResult, interest.dateStart, interest.dateEnd);
        return { interestResult };
      }
      case finePercentageType.id: {
        interestResult = value * (interest.percentage / 100) * time;
        return { interestResult };
      }
      default: {
        interestResult = value * (interest.percentage / 100) * time;
        return { interestResult };
      }
    }
  }
}
