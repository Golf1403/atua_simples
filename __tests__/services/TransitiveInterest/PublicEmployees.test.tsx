import { typePublicEmployees } from '@data/calculations/civilCodeTypes';
import { typeCompound } from '@data/calculations/interestTypes';
import { poupancaNovaType, poupancaNovaWithSelicType, poupancaType } from '@data/calculations/poupancaTypes';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import MonetaryInterestImp from '@interfaces/calculations/MonetaryInterestImp';
import TransitiveInterestService from '@services/TransitiveInterestService';
import { waitFor } from '@testing-library/react';
import CivilCodeInterest from '@/enums/CivilCodeInterest';
import { initialInterest } from '@/services/TransitiveInterestService/Savings';
import indexes1 from '../data/indexes.json';
import indexes from '../data/memcalcs.json';
import { AllMemcalcsImp } from '@/services/CalculationsServices/CurrentAccountService/AccountService';
const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;
const interestIndexes: InterestIndexesImp = JSON.parse(JSON.stringify(indexes1)) as InterestIndexesImp;

describe('PublicEmployees', () => {
  const transitiveInterestService = new TransitiveInterestService();

  test('shoud calculate the public employees interest correctly with savings type', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typePublicEmployees.id,
        administrativeNatureFirstDate: '31/07/2001',
        poupancaType: poupancaType.id,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 451, pointFive: 47.5, savings: 76.81, selic: 0 });
    });
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typePublicEmployees.id,
        administrativeNatureFirstDate: '31/07/2001',
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        poupancaType: poupancaType.id,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 8702.75, pointFive: 60.61, savings: 115.11, selic: 0 });
    });
  });

  test('shoud calculate the public employees interest correctly with new savings type', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typePublicEmployees.id,
        administrativeNatureFirstDate: '31/07/2001',
        poupancaType: poupancaNovaType.id,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 451, pointFive: 47.5, savings: 68.51, selic: 0 });
    });
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        type: typeCompound.id,
        dateStart: '01/01/1964',
        dateEnd: '01/01/2021',
        civilCode: typePublicEmployees.id,
        administrativeNatureFirstDate: '31/07/2001',
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 1000,
        },
        poupancaType: poupancaNovaType.id,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 8702.75, pointFive: 60.61, savings: 98.03, selic: 0 });
    });
  });
  test('shoud calculate the public employees interest correctly before of the new savings', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/05/2001',
        dateEnd: '01/05/2009',
        civilCode: typePublicEmployees.id,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 40102.01,
        },
        administrativeNatureFirstDate: '31/07/2001',
        poupancaType: poupancaNovaType.id,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 3, pointFive: 46.5, savings: 0, selic: 0 });
    });
  });
  test('shoud calculate the public employees interest correctly', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/11/2018',
        dateEnd: '01/08/2023',
        civilCode: CivilCodeInterest.PUBLIC_EMPLOYEES,
        calculatedInfo: {
          ...initialInterest.calculatedInfo,
          value: 10421.96,
        },
        administrativeNatureFirstDate: '31/07/2001',
        administrativeNatureSecondDate: '30/06/2009',
        administrativeNatureThirdDate: '01/07/2009',
        poupancaType: poupancaNovaWithSelicType.value,
      };

      const publicEmployees = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
      });
      expect(publicEmployees?.percentage).toEqual({ one: 0, pointFive: 0, savings: 19.41, selic: 0 });
    });
  });
});
