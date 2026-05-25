import { typeAccountCurrent, typeArt354 } from '@/data/calculations/currentTypes';
import { finePercentageType } from '@data/calculations/fineEntryTypes';
import AccountImp from '@interfaces/AccountImp';
import CurrentAuthorImp from '@interfaces/calculations/CurrentAuthorImp';
import CurrentInterestFineImp, { CurrentInterestRestImp } from '@interfaces/calculations/CurrentInterestFineImp';
import CurrentAccountService, {
  AllMemcalcsImp,
  CalculateImp,
} from '@services/CalculationsServices/CurrentAccountService/AccountService';
import {
  CurrentAccountImp,
  CurrentAuthorTypes,
  initialExpenseOccurrence,
  initialFeeOccurrence,
  initialFine,
  initialInstallmentOccurrence,
  initialInterest,
  typeCorrection,
  typeFine,
  typeFineCorrection,
  typeTotal,
} from '@/hooks/interfaces/CurrentAccountHookImp';
import { waitFor } from '@testing-library/react';
import { roundNumber } from '@utils/numberUtils';
import {
  CurrentExpenseImp,
  CurrentFeeOccorrenceImp,
  CurrentInstallmentOccorrenceImp,
} from '@/interfaces/calculations/CurrentOccurrenceImp';
import { initialAccount, initialAuthor, initialCurrentAuthor } from '@/hooks/currentAccount';
import { typeSelectIndex } from '@/data/calculations/civilCodeTypes';
import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
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
  describe('only installment', () => {
    const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
      ...initialInstallmentOccurrence,
      date: dateStart,
      value: 1000,
    };

    test('must calculate type art354 with current account module correctly', async () => {
      await waitFor(async () => {
        const updateTo = '01/01/2011';
        const positive = true;

        const occurrences = [installmentOccurrence];

        const current = {
          ...initialCurrentAuthor,
          occurrences,
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
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });

        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(view.balance).toBe(1088.64);
        expect(view.value).toBe(0);
        expect(view.date).toBe(account.current.updateTo);

        expect(calculate.authorList.length).toBeGreaterThanOrEqual(1);
        const calculateListLength = calculate.authorList.length - 1;
        const occurrenceAuthor = calculate.authorList[calculateListLength];
        expect(occurrenceAuthor.occurrenceTotal).toBe(1088.64);
      });
    });
  });
  describe('multiple installments without monetary correction ', () => {
    const updateTo = '01/01/2021';
    test('must calculate (art354 & proportional) types correctly', async () => {
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: dateStart,
        value: 1000,
      };
      const installmentOccurrenc2: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrence,
        date: '01/01/2011',
        value: 2000,
      };
      const installmentOccurrenc3: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc2,
        date: '01/02/2011',
      };
      const installmentOccurrenc4: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc3,
        date: '01/03/2011',
      };

      const interest: CurrentInterestRestImp = {
        ...initialInterest,
        isCorrection: false,
        dateStart,
        dateEnd: updateTo,
        value: 1,
        tax: 0,
      };

      const occurrences = [installmentOccurrence, installmentOccurrenc2, installmentOccurrenc3, installmentOccurrenc4];
      const interestFines = [interest];

      await waitFor(async () => {
        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list: [current],
        };

        const currentAccount: AccountImp = {
          ...initialAccount.current,
          updateTo,
          positive: true,
          indexId,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: currentAccount,
          infos: {
            ...initialAccount.infos,
            type: typeArt354.id,
          },
          list: [currentAccount],
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(roundNumber(view.balance, 2)).toBe(30342.08);
      });
    });
  });
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

    const occurrences = [installmentOccurrence, installmentOccurrence2, installmentOccurrence3, installmentOccurrence4];

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

    test('must calculate type art354 with current account module correctly', async () => {
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
            type: typeArt354.id,
          },
          list: listAccount,
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(roundNumber(view.balance, 2)).toBe(30654.42);
      });
    });
  });

  describe('installment plus accrued interest ', () => {
    const updateTo = '01/01/2021';

    test('must calculate type art354 with current account module correctly', async () => {
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: dateStart,
        value: 1000,
      };
      const installmentOccurrenc2: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrence,
        date: '01/01/2011',
        value: 2000,
      };
      const installmentOccurrenc3: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc2,
        date: '01/02/2011',
      };
      const installmentOccurrenc4: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc3,
        date: '01/03/2011',
      };

      const interest: CurrentInterestFineImp = {
        ...initialInterest,
        isCorrection: false,
        dateStart,
        dateEnd: updateTo,
        value: 1,
        tax: 0,
      };

      const occurrences = [installmentOccurrence, installmentOccurrenc2, installmentOccurrenc3, installmentOccurrenc4];
      const interestFines = [interest];

      await waitFor(async () => {
        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list: [current],
        };

        const currentAccount: AccountImp = {
          ...initialAccount.current,
          updateTo,
          positive: true,
          indexId,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: currentAccount,
          infos: {
            ...initialAccount.infos,
            type: typeAccountCurrent.id,
          },
          list: [currentAccount],
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(roundNumber(view.balance, 2)).toBe(31050);
      });
    });
  });
  describe('installments and interest with fees ', () => {
    const updateTo = '01/01/2021';

    test('must calculate type art354 with current account module correctly', async () => {
      const feeWithCorrection: CurrentFeeOccorrenceImp = {
        ...initialFeeOccurrence,
        date: '01/01/2011',
        updateSince: '01/01/2010',
        value: 500,
        tax: 10,
      };

      const feeWithoutCorrection: CurrentFeeOccorrenceImp = {
        ...initialFeeOccurrence,
        date: '01/01/2021',
        updateSince: '01/01/2021',
        value: 0,
        tax: 10,
      };

      const expenseOccurrence1: CurrentExpenseImp = {
        ...initialExpenseOccurrence,
        date: '01/01/2011',
        value: 200,
      };
      const expenseOccurrence2: CurrentExpenseImp = {
        ...initialExpenseOccurrence,
        date: '01/01/2021',
        value: 150,
      };
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        value: 1000,
        date: dateStart,
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

      const occurrences = [
        feeWithCorrection,
        feeWithoutCorrection,
        expenseOccurrence1,
        expenseOccurrence2,
        installmentOccurrence,
        installmentOccurrence2,
        installmentOccurrence3,
        installmentOccurrence4,
      ];

      const interestWithoutCorrection: CurrentInterestFineImp = {
        ...initialInterest,
        dateStart,
        dateEnd: '01/01/2011',
        value: 1,
        isCorrection: false,
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
        selectType: finePercentageType.id,
        dateStart: '01/12/2010',
        dateEnd: '01/01/2011',
        value: 10,
      };

      const interestFines = [interestWithCorrection, interestWithoutCorrection, fine];
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
            type: typeArt354.id,
          },
          list: listAccount,
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        expect(calculate.views.length).toBeGreaterThanOrEqual(1);
        const [view] = calculate.views.filter(view => view.type == typeTotal.id);
        expect(roundNumber(view.balance, 2)).toBe(35927.06);
      });
    });
  });

  describe('installment plus accrued transitive interest ', () => {
    const updateTo = '01/01/2021';

    test('If there is transitive interest to select an index and it is marked "without correction", there should be no correction in the interest period.', async () => {
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: dateStart,
        value: 1000,
      };
      const installmentOccurrenc2: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrence,
        date: '01/01/2011',
        value: 2000,
      };
      const installmentOccurrenc3: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc2,
        date: '01/02/2011',
      };

      const interest: CurrentInterestFineImp = {
        ...initialInterest,
        civilCode: typeSelectIndex.id,
        index: '73',
        formula: 'S',
        isCorrection: false,
        onInterestWithoutCorrection: true,
        dateStart,
        dateEnd: installmentOccurrenc2.date,
        value: 1,
        tax: 0,
      };

      const occurrences = [installmentOccurrence, installmentOccurrenc2, installmentOccurrenc3];
      const interestFines = [interest];

      await waitFor(async () => {
        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list: [current],
        };

        const currentAccount: AccountImp = {
          ...initialAccount.current,
          updateTo,
          positive: true,
          indexId,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: currentAccount,
          infos: {
            ...initialAccount.infos,
            type: typeAccountCurrent.id,
          },
          list: [currentAccount],
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });

        const viewsFiltered = calculate.views.filter(
          view =>
            moment(view.date, dateFormatEnum.DEFAULT).isSameOrAfter(
              moment(installmentOccurrence.date, dateFormatEnum.DEFAULT)
            ) &&
            moment(view.date, dateFormatEnum.DEFAULT).isBefore(
              moment(installmentOccurrenc2.date, dateFormatEnum.DEFAULT)
            )
        );
        expect(viewsFiltered.length).toEqual(2);
        const isExistCorrection = viewsFiltered.find(view => view.type.includes(typeCorrection.id));
        expect(isExistCorrection).toEqual(undefined);
      });
    });
  });

  describe('separate balante fine', () => {
    const updateTo = '01/01/2013';

    test('If there is correction', async () => {
      const installmentOccurrence: CurrentInstallmentOccorrenceImp = {
        ...initialInstallmentOccurrence,
        date: dateStart,
        value: 1000,
      };
      const installmentOccurrenc2: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrence,
        date: '01/01/2011',
        value: 2000,
      };
      const installmentOccurrenc3: CurrentInstallmentOccorrenceImp = {
        ...installmentOccurrenc2,
        date: '01/01/2012',
      };

      const fine: CurrentInterestFineImp = {
        ...initialFine,
        isCorrection: true,
        dateStart,
        dateEnd: updateTo,
        tax: 0,
        selectType: finePercentageType.id,
        value: 10,
      };

      const occurrences = [installmentOccurrence, installmentOccurrenc2, installmentOccurrenc3];
      const interestFines = [fine];

      await waitFor(async () => {
        const current: CurrentAuthorImp = {
          ...initialCurrentAuthor,
          occurrences,
          interestFines,
        };

        const author: CurrentAuthorTypes = {
          ...initialAuthor,
          list: [current],
        };

        const currentAccount: AccountImp = {
          ...initialAccount.current,
          updateTo,
          positive: true,
          indexId,
        };

        const account: CurrentAccountImp = {
          ...initialAccount,
          current: currentAccount,
          infos: {
            ...initialAccount.infos,
            type: typeArt354.id,
          },
          list: [currentAccount],
        };

        const payload: CalculateImp = {
          account,
          author,
          feeFines: { list: [], total: 0 },
          allMemcalcs,
          interestIndexes,
          interestIndexesFromLaw: [],
          memCalcs,
          nomenclatures,
          authorIndex: 0,
        };

        const calculate = await accountService.calculate({ ...payload, isTest: true });
        const viewsFine = calculate.views.filter(view => view.type.includes(typeFine.id));
        expect(viewsFine.length).toEqual(5);

        let fineBalance = 0;

        expect(viewsFine[0].type).toEqual(typeFine.id);
        expect(viewsFine[0].value).toEqual(1306.3680000000002);
        fineBalance += 1306.3680000000002;
        fineBalance = roundNumber(fineBalance, 2);
        expect(roundNumber(viewsFine[0].fineBalance || 0, 2)).toEqual(fineBalance);

        expect(viewsFine[1].type).toEqual(typeFineCorrection.id);
        expect(viewsFine[1].value).toEqual(72.80000000000018);
        fineBalance += viewsFine[1].value;
        fineBalance = roundNumber(fineBalance, 2);
        expect(roundNumber(viewsFine[1]?.fineBalance || 0, 2)).toEqual(fineBalance);

        expect(viewsFine[2].type).toEqual(typeFine.id);
        expect(viewsFine[2].value).toEqual(3912.924);
        fineBalance += viewsFine[2].value;
        fineBalance = roundNumber(fineBalance, 2);
        expect(roundNumber(viewsFine[2]?.fineBalance || 0, 2)).toEqual(fineBalance);

        expect(viewsFine[3].type).toEqual(typeFineCorrection.id);
        expect(viewsFine[3].value).toEqual(378.6899999999996);
        fineBalance += viewsFine[3].value;
        fineBalance = roundNumber(fineBalance, 2);
        expect(roundNumber(viewsFine[3]?.fineBalance || 0, 2)).toEqual(fineBalance);

        expect(viewsFine[4].type).toEqual(typeFine.id);
        expect(viewsFine[4].value).toEqual(6764.664);
        fineBalance += viewsFine[4].value;
        fineBalance = roundNumber(fineBalance, 2);
        expect(roundNumber(viewsFine[4]?.fineBalance || 0, 2)).toEqual(fineBalance);
      });
    });
  });
});
