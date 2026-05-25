import { typeMonthlyBeforeLaw, typeProRataDayBeforeLaw } from '@data/calculations/civilCodeTypes';
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

const interestIndexesFromLaw = [
  {
    inadata: '2024-07-01T00:00:00.000Z',
    selicValue: '0.9071220000',
    IPCA15Value: '0.3000000000',
    factorSubstractResult: '0.605306081754735793',
    dateApply: 31,
    monthApply: '8/2024',
    dailyPercent: '0.0195260026372495416975',
  },
  {
    inadata: '2024-08-01T00:00:00.000Z',
    selicValue: '0.8675120000',
    IPCA15Value: '0.1900000000',
    factorSubstractResult: '0.676227168380077852',
    dateApply: 30,
    monthApply: '9/2024',
    dailyPercent: '0.0225409056126692617360',
  },
  {
    inadata: '2024-09-01T00:00:00.000Z',
    selicValue: '0.8351570000',
    IPCA15Value: '0.1300000000',
    factorSubstractResult: '0.704241486068111455',
    dateApply: 31,
    monthApply: '10/2024',
    dailyPercent: '0.0227174672925197243583',
  },
  {
    inadata: '2024-10-01T00:00:00.000Z',
    selicValue: '0.92795800',
    IPCA15Value: '0.5400000000',
    factorSubstractResult: '0.385874',
    dateApply: 30,
    monthApply: '11/2024',
    dailyPercent: '0.012862',
  },
  {
    inadata: '2024-11-01T00:00:00.000Z',
    selicValue: '0.79299000',
    IPCA15Value: '0.6200',
    factorSubstractResult: '0.171924',
    dateApply: 31,
    monthApply: '12/2024',
    dailyPercent: '0.005546',
  },
];

describe('Law', () => {
  const transitiveInterestService = new TransitiveInterestService();
  test('shoud calculate if before law', async () => {
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '05/09/2024',
          dateEnd: '10/01/2025',
          civilCode: typeMonthlyBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(12);
      } catch (error) {
        console.error(error);
      }
    });
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/01/2023',
          dateEnd: '01/01/2024',
          civilCode: typeMonthlyBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(12);
      } catch (error) {
        console.error(error);
      }
    });
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/08/2024',
          dateEnd: '02/08/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.03225806451612903);
      } catch (error) {
        console.error(error);
      }
    });
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/07/2024',
          dateEnd: '01/08/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(1);
      } catch (error) {
        console.error(error);
      }
    });
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/07/2024',
          dateEnd: '10/08/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(1.2903225806451613);
      } catch (error) {
        console.error(error);
      }
    });
  });

  test('shoud calculate if between law', async () => {
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '30/08/2024',
          dateEnd: '30/08/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.019526002637249542);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '30/08/2024',
          dateEnd: '31/08/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.019526002637249542);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '30/08/2024',
          dateEnd: '01/09/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.039052005274499084);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '31/08/2024',
          dateEnd: '10/09/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.22239415315127292);
      } catch (error) {
        console.error(error);
      }
    });
  });

  test('shoud calculate if after law', async () => {
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/08/2024',
          dateEnd: '01/09/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.9745358762422409);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '05/09/2024',
          dateEnd: '10/09/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.11270452806334631);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/09/2024',
          dateEnd: '01/12/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(1.7663286544481895);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/09/2024',
          dateEnd: '30/09/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.6536862627674086);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/10/2024',
          dateEnd: '30/10/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.658806551483072);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '31/08/2024',
          dateEnd: '01/11/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(1.399994657085439);
      } catch (error) {
        console.error(error);
      }
    });
  });

  test('should calculate for new date ranges', async () => {
    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/11/2024',
          dateEnd: '01/12/2024',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.8225806451612904);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/12/2024',
          dateEnd: '01/01/2025',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.8225806451612904);
      } catch (error) {
        console.error(error);
      }
    });

    await waitFor(async () => {
      try {
        const interest: MonetaryInterestImp = {
          ...initialInterest,
          dateStart: '01/01/2025',
          dateEnd: '01/02/2025',
          civilCode: typeProRataDayBeforeLaw.id,
        };

        const law = await transitiveInterestService.run({
          interest,
          interestIndexes,
          interestIndexesFromLaw,
          allMemcalcs,
        });

        const percentage = law?.time || 0;
        expect(percentage).toEqual(0.8225806451612904);
      } catch (error) {
        console.error(error);
      }
    });
  });
  test('comparativo planilha', async () => {
    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/07/2024',
        dateEnd: '01/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(1);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/08/2024',
        dateEnd: '29/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.9032258064516129);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/08/2024',
        dateEnd: '30/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.9354838709677419);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/08/2024',
        dateEnd: '31/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.9550098736049915);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '28/08/2024',
        dateEnd: '29/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.03225806451612903);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '28/08/2024',
        dateEnd: '30/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.06451612903225806);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '28/08/2024',
        dateEnd: '31/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.08404213166950761);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '29/08/2024',
        dateEnd: '30/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.03225806451612903);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '30/08/2024',
        dateEnd: '31/08/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.019526002637249542);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '31/08/2024',
        dateEnd: '01/09/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.019526002637249542);
    });

    await waitFor(async () => {
      const interest: MonetaryInterestImp = {
        ...initialInterest,
        dateStart: '01/09/2024',
        dateEnd: '02/09/2024',
        civilCode: typeProRataDayBeforeLaw.id,
      };

      const law = await transitiveInterestService.run({
        interest,
        interestIndexes,
        interestIndexesFromLaw,
        allMemcalcs,
      });

      const percentage = law?.time || 0;
      expect(percentage).toEqual(0.022540905612669263);
    });
  });
});
