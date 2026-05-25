import { MonetaryCorrectionCalculateImp } from '@interfaces/calculations/CorrectionImp';
import MonetaryCorrectionService from '@services/MonetaryCorrectionService';
import { waitFor } from '@testing-library/react';
import { initialAccountValue } from '@/store/simple/reducer';
import { AllMemcalcsImp } from '@/services/CalculationsServices/CurrentAccountService/AccountService';
import indexes from './data/memcalcs.json';

const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;

describe('MoneryCorrectionService', () => {
  const monetaryCorrectionService = new MonetaryCorrectionService();
  test('shoud calculate the correction monetary from MEDIA index correctly', async () => {
    const indexId = 95;
    const memCalcs = allMemcalcs?.[indexId];

    await waitFor(async () => {
      const dateStart = '10/01/2010';
      const dateEnd = '15/03/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        memCalcs,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10187.75);
    });

    await waitFor(async () => {
      const dateStart = '01/02/2010';
      const dateEnd = '02/03/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        value: 10000,
        memCalcs,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10091.67);
    });
  });

  test('shoud calculate the correction monetary from IPCA index correctly', async () => {
    const indexId = 59;
    const memCalcs = allMemcalcs?.[indexId];

    await waitFor(async () => {
      const dateStart = '01/01/2010';
      const dateEnd = '01/04/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        value: 10000,
        memCalcs,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10206.38);
    });

    await waitFor(async () => {
      const dateStart = '15/01/2010';
      const dateEnd = '01/04/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        value: 10000,
        memCalcs,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10172);
    });
    await waitFor(async () => {
      const dateStart = '01/01/2010';
      const dateEnd = '15/04/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        memCalcs,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10233.49);
    });
    await waitFor(async () => {
      const dateStart = '01/01/2010';
      const dateEnd = '01/02/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        memCalcs,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10075);
    });

    await waitFor(async () => {
      const dateStart = '01/01/2010';
      const dateEnd = '01/01/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        memCalcs,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10000);
    });

    await waitFor(async () => {
      const dateStart = '28/01/2010';
      const dateEnd = '28/02/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        date: dateStart,
        memCalcs,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(10084.92);
    });
  });

  test('shoud calculate the correction monetary from IGP-M index correctly', async () => {
    const indexId = 87;
    const memCalcs = allMemcalcs?.[indexId];

    await waitFor(async () => {
      const dateStart = '10/01/1994';
      const dateEnd = '10/12/1994';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        memCalcs,
        date: dateStart,
        value: 100000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(318.54);
    });

    await waitFor(async () => {
      const dateStart = '10/01/1964';
      const dateEnd = '10/01/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        memCalcs,
        date: dateStart,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(16.79);
    });

    await waitFor(async () => {
      const dateStart = '10/01/1964';
      const dateEnd = '01/01/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        memCalcs,
        date: dateStart,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(16.76);
    });

    await waitFor(async () => {
      const dateStart = '01/01/1964';
      const dateEnd = '20/01/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId, proRataDay: true },
        memCalcs,
        date: dateStart,
        value: 10000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(16.82);
    });
  });
});
