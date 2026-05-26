import { DataTableCellImp } from '@/interfaces/DataTableImp';

export type FinancingType = 'price' | 'sac' | 'sacre' | 'linear';

export type FinancingCalculationInput = {
  date: string;
  deadline: number;
  interest: string | number;
  name?: string;
  positive?: boolean;
  shortage?: number;
  type: FinancingType | string;
  value: number;
};

export type FinancingTotals = {
  amortization: number;
  correction: number;
  installment: number;
  interest: number;
  sum: number;
};

export type FinancingCalculationResult = {
  installments: DataTableCellImp[];
  total: FinancingTotals;
};

export type FinancingStrategyInput = {
  balance: number;
  context: FinancingStrategyContext;
  interest: number;
};

export type FinancingStrategyResult = {
  amortization: number;
  installment: number;
};

export type FinancingStrategy = (input: FinancingStrategyInput) => FinancingStrategyResult;

export type FinancingStrategyContext = {
  amortizationPeriods: number;
  fixedAmortization: number;
  monthlyRate: number;
  originalValue: number;
};
