import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentInterestFineImp, {
  CurrenFineRestImp,
  CurrentInterestRestImp,
} from '@interfaces/calculations/CurrentInterestFineImp';
import CurrentAccountService, {
  AllMemcalcsImp,
  CalculateImp,
} from '@services/CalculationsServices/CurrentAccountService/AccountService';
import {
  CurrentAccountImp,
  CurrentAuthorTypes,
  initialFeeOccurrence,
  initialFine,
  initialInstallmentOccurrence,
  initialInterest,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { waitFor } from '@testing-library/react';
import {
  CurrentFeeOccorrenceImp,
  CurrentInstallmentOccorrenceImp,
} from '@/interfaces/calculations/CurrentOccurrenceImp';
import { typeFine } from '@/hooks/interfaces/CurrentAccountHookImp';
import { typeInterest } from '@/hooks/interfaces/CurrentAccountHookImp';
import { initialCurrentAuthor } from '@/hooks/currentAccount';
import { initialAuthor } from '@/hooks/currentAccount';
import { initialAccount } from '@/hooks/currentAccount';

import indexes1 from '../data/indexes.json';
import indexes from '../data/memcalcs.json';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;
const interestIndexes: InterestIndexesImp = JSON.parse(JSON.stringify(indexes1)) as InterestIndexesImp;

const indexId = 95;
const memCalcs = allMemcalcs?.[indexId];
const nomenclatures: any[] = [];

const accountService = new CurrentAccountService();

describe('InterestFine', () => {
  describe('task 4968028673', () => {
    const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
      ...initialInstallmentOccurrence,
      date: '01/12/2018',
      value: 15000,
    };
    const installmentOccurrence2: CurrentInstallmentOccorrenceImp = {
      ...initialInstallmentOccurrence,
      date: '01/12/2020',
      value: 25962.08,
    };
    const feeOccurrence: CurrentFeeOccorrenceImp = {
      ...initialFeeOccurrence,
      date: '02/12/2020',
      updateSince: '02/12/2020',
      value: 25962.08,
    };
    const paymentOccurrence: CurrentFeeOccorrenceImp = {
      ...initialFeeOccurrence,
      date: '04/12/2020',
      updateSince: '04/12/2020',
      value: 30000,
    };

    test('same start dates with interest before fine ', async () => {
      const fine: CurrenFineRestImp = {
        ...initialFine,
        dateStart: '31/10/2020',
        dateEnd: '03/12/2020',
        value: 10,
      };
      const interest: CurrentInterestRestImp = {
        ...initialInterest,
        dateStart: '31/10/2020',
        dateEnd: '01/12/2020',
        isCorrection: false,
        value: 1,
      };
      await waitFor(async () => {
        const updateTo = '01/01/2021';
        const positive = true;

        const occurrences = [installmentOccurrence, installmentOccurrence2, feeOccurrence, paymentOccurrence];
        const interestFines: CurrentInterestFineImp[] = [interest, fine];

        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const list: CurrentAuthorImp[] = [current];

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: { ...initialAccount.current, indexId, updateTo, positive },
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          interestIndexes,
          interestIndexesFromLaw: [],
          allMemcalcs,
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };
        const calculate = await accountService.calculate({ ...payload, isTest: true });
        const viewsCalculated = calculate.views.filter(
          view => view.type == typeFine.id || view.type == typeInterest.id
        );

        expect(viewsCalculated.length).toBeGreaterThanOrEqual(2);
        // const [interestResult, fineResult] = viewsCalculated;
        // expect(fineResult.type).toBe(typeFine.id);
        // expect(interestResult.type).toBe(typeInterest.id);
      });
    });
    test('same start dates with interest after fine ', async () => {
      const fine: CurrenFineRestImp = {
        ...initialFine,
        dateStart: '31/10/2020',
        dateEnd: '03/12/2020',
        value: 10,
      };
      const interest: CurrentInterestRestImp = {
        ...initialInterest,
        dateStart: '31/10/2020',
        dateEnd: '01/12/2020',
        value: 1,
      };
      await waitFor(async () => {
        const updateTo = '01/01/2021';
        const positive = true;

        const occurrences = [installmentOccurrence, installmentOccurrence2, feeOccurrence, paymentOccurrence];
        const interestFines: CurrentInterestFineImp[] = [fine, interest];

        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const list: CurrentAuthorImp[] = [current];

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: { ...initialAccount.current, indexId, updateTo, positive },
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          interestIndexes,
          interestIndexesFromLaw: [],
          allMemcalcs,
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        const viewsCalculated = calculate.views.filter(
          view => view.type == typeFine.id || view.type == typeInterest.id
        );
        expect(viewsCalculated.length).toBeGreaterThanOrEqual(2);
        const [fineResult, interestResult] = viewsCalculated;
        expect(fineResult.type).toBe(typeFine.id);
        expect(interestResult.type).toBe(typeInterest.id);
      });
    });
  });

  describe('interest with monetary correction should be value corrected', () => {
    test('... ', async () => {
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: '01/01/2000',
        value: 10000,
      };
      const installmentOccurrence2: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: '01/05/2000',
        value: 10000,
      };
      const interest: CurrentInterestFineImp = {
        ...initialInterest,
        dateStart: '01/01/2000',
        dateEnd: '01/01/2023',
        value: 1,
      };

      const occurrences = [installmentOccurrence, installmentOccurrence2];
      const interestFines: CurrentInterestFineImp[] = [interest];

      const current: CurrentAuthorImp = {
        ...initialCurrentAuthor,
        occurrences,
        interestFines,
      };

      const list: CurrentAuthorImp[] = [current];

      const author: CurrentAuthorTypes = {
        ...initialAuthor,
        list,
      };

      const account: CurrentAccountImp = {
        ...initialAccount,
        current: { ...initialAccount.current, indexId, updateTo: '01/01/2023', positive: true },
      };

      const payload: CalculateImp = {
        account,
        author,
        feeFines: { list: [], total: 0 },
        interestIndexes,
        interestIndexesFromLaw: [],
        allMemcalcs,
        memCalcs,
        nomenclatures,
        authorIndex: 0,
      };

      await waitFor(async () => {
        const calculate = await accountService.calculate({ ...payload, isTest: true });

        const interestsCalculated = calculate.views.filter(view => view.type == typeInterest.id);
        const [_, correction] = interestsCalculated;

        expect(correction.extraDescription).toContain(`somado ao saldo do juros anterior`);
      });
    });
  });
});
