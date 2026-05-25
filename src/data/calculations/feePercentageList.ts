import FeeCpcPercentageImp from '@interfaces/calculations/FeeCpcPercentageImp';

const feePercentageList: FeeCpcPercentageImp[] = [
  {
    text: 'até 200 salários mínimos (10% - 20%)',
    shortText: 'Até 200',
    minValue: 1,
    maxValue: 200,
    minPercentage: 10,
    maxPercentage: 20,
  },
  {
    text: 'de 200 SALÁRIOS até 2.000 salários (8% - 10%)',
    shortText: 'De 200 até 2.000',
    minValue: 200,
    maxValue: 2000,
    minPercentage: 8,
    maxPercentage: 10,
  },
  {
    text: 'de 2.000 SALÁRIOS até 20.000 salários (5% - 8%)',
    shortText: 'De 2.000 até 20.000',
    minValue: 2000,
    maxValue: 20000,
    minPercentage: 5,
    maxPercentage: 8,
  },
  {
    text: 'de 20.000 SALÁRIOS até 100.000 salários (3% - 5%)',
    shortText: 'De 20.000 até 100.000',
    minValue: 20000,
    maxValue: 100000,
    minPercentage: 3,
    maxPercentage: 5,
  },
  {
    text: 'acima de 100.000 salários mínimos (1% - 3%)',
    shortText: 'Acima de 100.000',
    minValue: 100000,
    maxValue: 99999999999999,
    minPercentage: 1,
    maxPercentage: 3,
  },
];

export default feePercentageList;
