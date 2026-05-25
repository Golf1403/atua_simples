import { MonetaryCorrectionCalculateImp } from '@interfaces/calculations/CorrectionImp';
import MonetaryCorrectionService from '@services/MonetaryCorrectionService';
import { waitFor } from '@testing-library/react';
import { initialAccountValue } from '@/store/simple/reducer';
import indexes from './data/memcalcs.json';
import { AllMemcalcsImp } from '@/services/CalculationsServices/CurrentAccountService/AccountService';

const allMemcalcs: AllMemcalcsImp = JSON.parse(JSON.stringify(indexes)) as AllMemcalcsImp;

describe('MoneryCorrectionService', () => {
  const monetaryCorrectionService = new MonetaryCorrectionService();
  test('shoud calculate the correction monetary from MEDIA index correctly', async () => {
    const indexId = 95;
    const memCalcs = allMemcalcs?.[indexId];

    await waitFor(async () => {
      const dateStart = '01/01/2010';
      const dateEnd = '01/03/2010';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId },
        memCalcs,
        date: dateStart,
        value: 1000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(1018.48);
    });
    await waitFor(async () => {
      const dateStart = '01/08/1964';
      const dateEnd = '01/01/2021';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId },
        memCalcs,
        date: dateStart,
        value: 1000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(3.19);
    });

    await waitFor(async () => {
      const dateStart = '01/08/1964';
      const dateEnd = '01/01/2023';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId },
        memCalcs,
        date: dateStart,
        value: 1000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(3.84);
    });
  });

  test('shoud calculate the correction monetary from IGP-M index correctly', async () => {
    const indexId = 87;
    const memCalcs = allMemcalcs?.[indexId];

    await waitFor(async () => {
      const dateStart = '01/08/1964';
      const dateEnd = '01/01/2023';

      const params: MonetaryCorrectionCalculateImp = {
        account: { ...initialAccountValue, updateTo: dateEnd, indexId },
        date: dateStart,
        memCalcs,
        value: 1000,
        isTest: true,
      };

      const correction = await monetaryCorrectionService.calculate(params);
      expect(correction.value).toBe(4.81);
    });
  });
});
