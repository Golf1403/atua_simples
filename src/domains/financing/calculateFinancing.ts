import moment from 'moment';
import { DataTableCellImp } from '@/interfaces/DataTableImp';
import { FinancingCalculationInput, FinancingCalculationResult, FinancingTotals } from './types';
import { financingStrategies, sacStrategy } from './strategies';

const toMonthlyRate = (interest: string | number): number => {
  const normalizedInterest = Number(String(interest).replace(',', '.')) || 0;
  return normalizedInterest / 100;
};

const sumTotals = (installments: DataTableCellImp[]): FinancingTotals => {
  return installments.reduce(
    (total: FinancingTotals, installment) => ({
      amortization: total.amortization + Number(installment.amortization || 0),
      correction: total.correction + Number(installment.correction || 0),
      installment: total.installment + Number(installment.installment || 0),
      interest: total.interest + Number(installment.interest || 0),
      sum: total.sum + Number(installment.installment || 0),
    }),
    {
      amortization: 0,
      correction: 0,
      installment: 0,
      interest: 0,
      sum: 0,
    }
  );
};

export const calculateFinancing = (financing: FinancingCalculationInput): FinancingCalculationResult => {
  const deadline = Number(financing.deadline);
  const shortage = Number(financing.shortage || 0);
  const amortizationPeriods = Math.max(deadline - shortage, 1);
  const monthlyRate = toMonthlyRate(financing.interest);
  const startDate = moment(financing.date, 'YYYY-MM-DD');
  const rows: DataTableCellImp[] = [];
  let balance = Number(financing.value);
  const fixedAmortization = balance / amortizationPeriods;
  const strategy = financingStrategies[financing.type] || sacStrategy;
  const context = {
    amortizationPeriods,
    fixedAmortization,
    monthlyRate,
    originalValue: balance,
  };

  for (let index = 0; index < deadline; index += 1) {
    const dueDate = startDate
      .clone()
      .add(index + 1, 'month')
      .format('YYYY-MM-DD');
    const debt = balance;
    const correctedDebt = debt;
    const interest = correctedDebt * monthlyRate;
    const isShortagePeriod = index < shortage;
    let amortization = 0;
    let installment = interest;

    if (!isShortagePeriod) {
      const result = strategy({
        balance,
        context,
        interest,
      });
      amortization = result.amortization;
      installment = result.installment;
    }

    balance = Math.max(balance - amortization, 0);

    rows.push({
      amortization,
      balance,
      correctedDebt,
      correction: 0,
      debt,
      dueDate,
      indexValue: 0,
      installment,
      interest,
      rate: monthlyRate,
    });
  }

  return {
    installments: rows,
    total: sumTotals(rows),
  };
};
