import CorrectionImp from '@interfaces/calculations/CorrectionImp';

export const currencyToCents = (raw: string) => {
  const withoutCurrency = raw.replace('R$', '');
  const [integer, decimal] = withoutCurrency.split(',');

  if (!decimal) {
    const value = `${integer}.00`;
    return parseFloat(value) * 100;
  }

  return parseFloat(withoutCurrency.replace(',', '.')) * 100;
};

export const parseCurrency = (raw: string) => {
  const [integer, decimal] = raw.split(',');

  if (!decimal) {
    const value = `${integer}.00`;
    return parseFloat(value);
  }

  return parseFloat(raw.replace(/\./g, '').replace(',', '.'));
};

export const currencyToString = (raw: number) => {
  return raw.toFixed(2).replace(',', '').replace('.', ',');
};

export const convertCurrencyToPtBr = (value?: number | null, withoutSign?: boolean) => {
  const result = Math.abs(Number((value || 0).toFixed(2))).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  if (withoutSign) {
    return result.replace('R$', '').trim();
  }

  return result;
};

export const valueWithCorrectionCurrency = (correction: CorrectionImp | undefined, value: number, input?: boolean) => {
  return correction
    ? `${input && correction.inputCoin ? correction.inputCoin : correction.correctedCoin} ${convertCurrencyToPtBr(
        value,
        true
      )}`
    : convertCurrencyToPtBr(value);
};

export const valueWithCurrency = (currency: string, value: number) => {
  return `${value < 0 ? '-' : ''}${currency}${convertCurrencyToPtBr(value, true)}`;
};

export const parsePercentage = (raw: number) => {
  const result = raw.toFixed(4).replace(',', '').replace('.', ',');
  return `${result} %`;
};

export const roundTwoDecimalCases = (value: number): number => {
  return +value.toFixed(2);
};
