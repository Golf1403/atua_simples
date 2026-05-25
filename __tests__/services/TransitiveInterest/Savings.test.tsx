import { typeSavings } from '@data/calculations/civilCodeTypes';
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

describe('Savings', () => {
  const transitiveInterestService = new TransitiveInterestService();

  test('shoud calculate the savings interest correctly', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/05/2012',
        dateEnd: '01/01/2021',
        civilCode: typeSavings.id,
      };

      const savings = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(savings?.percentage).toEqual({ one: 0, pointFive: 0, savings: 43.6963, selic: 0 });
    });
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/05/2012',
        dateEnd: '01/01/2021',
        civilCode: typeSavings.id,
      };

      const savings = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(savings?.percentage).toEqual({ one: 0, pointFive: 0, savings: 54.65, selic: 0 });
    });
  });
});
