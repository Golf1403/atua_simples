import ISelectOption from '@interfaces/SelectOptionImp';

export const typePayment: ISelectOption = {
  id: 'payments',
  value: 'payments',
  label: 'Pagamentos',
};
export const typeInstallment: ISelectOption = {
  id: 'installments',
  value: 'installments',
  label: 'Parcelas',
};
export const typeMonetaryCorrection: ISelectOption = {
  id: 'monetary-correction',
  value: 'monetary-correction',
  label: 'Correção monetária',
};
export const typeFee: ISelectOption = {
  id: 'fees',
  value: 'fees',
  label: 'Honorários',
};
export const typeExpenses: ISelectOption = {
  id: 'expenses',
  value: 'expenses',
  label: 'Despesas',
};

const typeOccorrenceOptions = [typePayment, typeInstallment, typeFee, typeExpenses];

export default typeOccorrenceOptions;
