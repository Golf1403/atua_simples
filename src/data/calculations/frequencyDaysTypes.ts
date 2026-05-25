export type FrequencyType = 'days' | 'bimonth' | 'month' | 'quarter' | 'semester' | 'year' | 'period';

export interface FrequencyImp {
  id: string;
  value: FrequencyType;
  name: string;
}

export const frequencyDayDaily: FrequencyImp = {
  id: 'daily',
  value: 'days',
  name: 'Ao Dia',
};
export const frequencyDayBimonthly: FrequencyImp = {
  id: 'bimonthly',
  value: 'bimonth',
  name: 'Ao Bimestre',
};
export const frequencyDayMonthly: FrequencyImp = {
  id: 'monthly',
  value: 'month',
  name: 'Ao Mês',
};
export const frequencyDayQuarterly: FrequencyImp = {
  id: 'quarterly',
  value: 'quarter',
  name: 'Ao Trimestre',
};
export const frequencyDaySemiannual: FrequencyImp = {
  id: 'semiannual',
  value: 'semester',
  name: 'Ao Semestre',
};
export const frequencyDayYearly: FrequencyImp = {
  id: 'yearly',
  value: 'year',
  name: 'Ao Ano',
};
export const frequencyDayPeriod: FrequencyImp = {
  id: 'period',
  value: 'period',
  name: 'Ao Período',
};

const frequencyDaysTypes = [
  frequencyDayDaily,
  frequencyDayMonthly,
  frequencyDayBimonthly,
  frequencyDayQuarterly,
  frequencyDaySemiannual,
  frequencyDayYearly,
  frequencyDayPeriod,
];

export const frequencyDaysTypesWithOutPeriod = [
  frequencyDayDaily,
  frequencyDayMonthly,
  frequencyDayBimonthly,
  frequencyDayQuarterly,
  frequencyDaySemiannual,
  frequencyDayYearly,
];

export default frequencyDaysTypes;
