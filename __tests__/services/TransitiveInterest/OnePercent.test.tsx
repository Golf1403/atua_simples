import { typeOnePercent } from '@data/calculations/civilCodeTypes';
import { typeCompound } from '@data/calculations/interestTypes';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import TransitiveInterestService from '@services/TransitiveInterestService';
import { waitFor } from '@testing-library/react';
import { initialInterest } from '@/services/TransitiveInterestService/Savings';
import indexes1 from '../data/indexes.json';
import indexes from '../data/memcalcs.json';
import { AllMemcalcsImp } from '@/services/CalculationsServices/CurrentAccountService/AccountService';
const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;
const interestIndexes: InterestIndexesImp = JSON.parse(JSON.stringify(indexes1)) as InterestIndexesImp;

describe('OnePercent', () => {
  const transitiveInterestService = new TransitiveInterestService();

  test('shoud calculate the one percent interest correctly', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        percentage: 2,
        dateStart: '01/01/2010',
        dateEnd: '01/01/2011',
        civilCode: typeOnePercent.id,
      };

      const onePercent = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(onePercent?.percentage.one).toEqual(12);
    });
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        percentage: 2,
        dateStart: '01/01/2010',
        dateEnd: '01/01/2011',
        civilCode: typeOnePercent.id,
      };

      const onePercent = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(onePercent?.percentage.one).toEqual(12.68);
    });
  });
});
