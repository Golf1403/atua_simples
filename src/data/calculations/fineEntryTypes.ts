export type PercentageOrFixedType = 'percentage' | 'fixed';

export type FineEntryType = {
  id: PercentageOrFixedType;
  name: 'Percentual' | 'Valor';
};

export const finePercentageType: FineEntryType = {
  id: 'percentage',
  name: 'Percentual',
};

export const fineAmountType: FineEntryType = {
  id: 'fixed',
  name: 'Valor',
};

const fineEntryTypes = [finePercentageType, fineAmountType];

export default fineEntryTypes;
