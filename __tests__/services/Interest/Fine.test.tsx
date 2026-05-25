import { initialInterest } from '@/services/TransitiveInterestService/Savings';
import { fineAmountType, finePercentageType } from '@data/calculations/fineEntryTypes';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import CalculateInterest from '@services/InterestService';
import { waitFor } from '@testing-library/react';

describe('FineService', () => {
  const calculateInterest = new CalculateInterest();
  test('shoud calculate the fine correctly using amount type', async () => {
    await waitFor(() => {
      const payload: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/2010',
        dateEnd: '01/01/2011',
        type: fineAmountType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payload);
      expect(correction.result).toEqual(payload.percentage * 12);
    });
  });

  test('shoud calculate the fine correctly using percentage type', async () => {
    await waitFor(() => {
      const payload: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/2010',
        dateEnd: '01/01/2011',
        type: finePercentageType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payload);

      expect(correction.value).toEqual(payload.calculatedInfo.value);
      expect(correction.totalPercentage).toEqual(payload.percentage * 12);
      expect(correction.result).toEqual(((payload.percentage * 12) / 100) * payload.calculatedInfo.value);
    });
  });
  test('shoud be 0, if the date start is after to date end ', async () => {
    await waitFor(() => {
      const payloadCompound: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '02/01/2011',
        dateEnd: '01/01/2011',
        type: fineAmountType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payloadCompound);

      expect(correction.value).toEqual(payloadCompound.calculatedInfo.value);
      expect(correction.totalPercentage).toEqual(0);
      expect(correction.result).toEqual(0);
    });
    await waitFor(() => {
      const payloadSimple: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '02/01/2011',
        dateEnd: '01/01/2011',
        type: finePercentageType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payloadSimple);

      expect(correction.value).toEqual(payloadSimple.calculatedInfo.value);
      expect(correction.totalPercentage).toEqual(0);
      expect(correction.result).toEqual(0);
    });
  });
  test('shoud be 0, if the date start is same to date end ', async () => {
    await waitFor(() => {
      const payloadCompound: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/2011',
        dateEnd: '01/01/2011',
        type: fineAmountType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payloadCompound);

      expect(correction.value).toEqual(payloadCompound.calculatedInfo.value);
      expect(correction.totalPercentage).toEqual(0);
      expect(correction.result).toEqual(0);
    });
    await waitFor(() => {
      const payloadSimple: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/2011',
        dateEnd: '01/01/2011',
        type: finePercentageType.id,
        percentage: 1,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        periodicity: 'month',
      };

      const correction = calculateInterest.run(payloadSimple);

      expect(correction.value).toEqual(payloadSimple.calculatedInfo.value);
      expect(correction.totalPercentage).toEqual(0);
      expect(correction.result).toEqual(0);
    });
  });
});
