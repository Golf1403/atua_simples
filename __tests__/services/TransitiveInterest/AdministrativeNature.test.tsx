import { typeAdministrativeNature } from '@data/calculations/civilCodeTypes';
import { typeCompound } from '@data/calculations/interestTypes';
import { poupancaNovaType, poupancaType } from '@data/calculations/poupancaTypes';
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

describe('AdministrativeNature', () => {
  const transitiveInterestService = new TransitiveInterestService();

  test('shoud calculate the administrative nature interest correctly with savings type', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typeAdministrativeNature.id,
        poupancaType: poupancaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 234, savings: 76.81, selic: 96.35 });
    });
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typeAdministrativeNature.id,
        poupancaType: poupancaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 932.0884, savings: 115.11, selic: 160.45 });
    });
  });

  test('shoud calculate the administrative nature interest correctly with new savings type', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typeAdministrativeNature.id,
        poupancaType: poupancaNovaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 234, savings: 68.51, selic: 96.35 });
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typeAdministrativeNature.id,
        poupancaType: poupancaNovaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 932.0884, savings: 98.03, selic: 160.45 });
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/2000',
        dateEnd: '01/07/2009',
        civilCode: typeAdministrativeNature.id,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 42216.19,
        },
        poupancaType: poupancaNovaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 18, savings: 0, selic: 96.35 });
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/01/2000',
        dateEnd: '01/07/2009',
        civilCode: typeAdministrativeNature.id,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 42216.19,
        },
        poupancaType: poupancaNovaType.id,
      };

      const administrativeNature = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(administrativeNature?.percentage).toEqual({ one: 0, pointFive: 19.6681, savings: 0, selic: 160.45 });
    });
  });
});
