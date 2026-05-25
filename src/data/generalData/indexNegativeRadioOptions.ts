import SelectOptionImp from '@/interfaces/SelectOptionImp';

export const indexNegative = {
  id: 'index-negative',
  label: 'Aceitar negativos',
  name: 'positive',
  value: 'index-negative',
};

export const indexPositive = {
  id: 'index-positive',
  label: 'Aceitar positivos',
  name: 'positive',
  value: 'index-positive',
};

export const indexDeflation = {
  id: 'index-deflation',
  label: 'Não permitir deflação do valor nominal',
  name: 'deflation',
  value: 'index-deflation',
};

const indexNegativeRadioOptions: SelectOptionImp[] = [indexNegative, indexPositive, indexDeflation];

export default indexNegativeRadioOptions;
