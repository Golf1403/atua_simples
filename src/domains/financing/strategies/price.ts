import { FinancingStrategy } from '../types';

const calculatePriceInstallment = (value: number, monthlyRate: number, periods: number): number => {
  if (monthlyRate <= 0) return value / periods;

  const factor = Math.pow(1 + monthlyRate, periods);
  return (value * monthlyRate * factor) / (factor - 1);
};

// Tabela Price: a prestacao fica fixa e a amortizacao cresce conforme os juros diminuem.
export const priceStrategy: FinancingStrategy = ({ balance, context, interest }) => {
  const installment = calculatePriceInstallment(
    context.originalValue,
    context.monthlyRate,
    context.amortizationPeriods
  );

  return {
    amortization: Math.min(Math.max(installment - interest, 0), balance),
    installment,
  };
};
