import { PercentageOrFixedType } from './fineEntryTypes';

export type InterestTypes = 'default' | 'compensatory' | 'compound';
export type InterestTypesWithPeriod = InterestTypes | 'period';
export type FineType = PercentageOrFixedType;
export type InterestTypesWithPeriodAndFine = InterestTypesWithPeriod | FineType;

interface InterestTypesImp {
  id: InterestTypesWithPeriodAndFine;
  value: InterestTypesWithPeriodAndFine;
  name: string;
}

export const typeDefault: InterestTypesImp = {
  id: 'default',
  value: 'default',
  name: 'Juros Moratórios',
};
export const typeCompensatory: InterestTypesImp = {
  id: 'compensatory',
  value: 'compensatory',
  name: 'Juros Compensatórios',
};
export const typeCompound: InterestTypesImp = {
  id: 'compound',
  value: 'compound',
  name: 'Juros Compostos',
};
export const typePeriod: InterestTypesImp = {
  id: 'period',
  value: 'period',
  name: 'Juros no Período',
};

const interestTypes = [typeDefault, typeCompensatory, typeCompound, typePeriod];
export const interestTypesIds = [typeDefault.id, typeCompensatory.id, typeCompound.id, typePeriod.id];
export default interestTypes;
