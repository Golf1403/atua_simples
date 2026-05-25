import { typeProportional } from '@/data/calculations/currentTypes';
import { finePercentageType } from '@data/calculations/fineEntryTypes';
import AccountImp from '@interfaces/AccountImp';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentInterestFineImp from '@interfaces/calculations/CurrentInterestFineImp';
import CurrentAccountService, {
  AllMemcalcsImp,
  CalculateImp,
} from '@services/CalculationsServices/CurrentAccountService/AccountService';
import {
  CurrentAccountImp,
  CurrentAuthorTypes,
  initialFine,
  initialInstallmentOccurrence,
  initialInterest,
  initialPaymentOccurrence,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { waitFor } from '@testing-library/react';
import { roundNumber } from '@utils/numberUtils';
import { CurrentInstallmentOccorrenceImp, CurrentPaymentImp } from '@/interfaces/calculations/CurrentOccurrenceImp';
import { initialAccount, initialAuthor, initialCurrentAuthor } from '@/hooks/currentAccount';

import indexes1 from '../data/indexes.json';
import indexes from '../data/memcalcs.json';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;
const interestIndexes: InterestIndexesImp = JSON.parse(JSON.stringify(indexes1)) as InterestIndexesImp;

const dateStart = '01/01/2010';
const indexId = 95;
const memCalcs = allMemcalcs?.[indexId];
const nomenclatures: any[] = [];

const accountService = new CurrentAccountService();

describe('CurrentAccount', () => {
  describe('installments and interest with fines ', () => {
    const updateTo = '01/01/2021';
    const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
      ...initialInstallmentOccurrence,
      date: dateStart,
      value: 1000,
    };
    const installmentOccurrence2: CurrentInstallmentOccorrenceImp = {
      ...installmentOccurrence,
      date: '01/01/2011',
      value: 2000,
    };
    const installmentOccurrence3: CurrentInstallmentOccorrenceImp = {
      ...installmentOccurrence2,
      date: '01/02/2011',
      value: 2000,
    };
    const installmentOccurrence4: CurrentInstallmentOccorrenceImp = {
      ...installmentOccurrence2,
      date: '01/03/2011',
      value: 2000,
    };

    const paymentOccurrence1: CurrentPaymentImp = {
      ...initialPaymentOccurrence,
      date: '01/03/2011',
      value: 2000,
    };

    const occurrences = [
      installmentOccurrence,
      installmentOccurrence2,
      installmentOccurrence3,
      installmentOccurrence4,
      paymentOccurrence1,
    ];

    const interestWithoutCorrection: CurrentInterestFineImp = {
      ...initialInterest,
      isCorrection: false,
      dateStart,
      dateEnd: '01/01/2011',
      value: 1,
    };

    const interestWithCorrection: CurrentInterestFineImp = {
      ...initialInterest,
      dateStart: '01/01/2011',
      dateEnd: updateTo,
      value: 1,
      isCorrection: true,
    };

    const fine: CurrentInterestFineImp = {
      ...initialFine,
      isCorrection: false,
      selectType: finePercentageType.id,
      dateStart: '01/12/2010',
      dateEnd: '01/01/2011',
      value: 10,
    };

    test('must calculate type proportinal with current account module correctly', async () => {
      const interestFines = [interestWithoutCorrection, interestWithCorrection, fine];

      await waitFor(async () => {
        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const listAuthor = [current];

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list: listAuthor,
        };

        const positive = true;

        const currentAccount: AccountImp = {
          ...initialAccount.current,
          updateTo,
          positive,
          indexId,
        };

        const listAccount = [currentAccount];

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: currentAccount,
          infos: {
            ...initialAccount.infos,
            type: typeProportional.id,
          },
          list: listAccount,
        };

        const payload: CalculateImp = {
          account,
          author,
          authorIndex: 0,
          feeFines: { list: [], total: 0 },
          interestIndexes,
          interestIndexesFromLaw: [],
          allMemcalcs,
          memCalcs,
          nomenclatures,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });

        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(roundNumber(view.balance, 2)).toBe(22368.12);
      });
    });
  });
});
