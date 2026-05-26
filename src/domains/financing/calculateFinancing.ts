import moment from 'moment';
import { DataTableCellImp } from '@/interfaces/DataTableImp';
import { FinancingCalculationInput, FinancingCalculationResult, FinancingTotals } from './types';

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

const calculatePriceInstallment = (balance: number, monthlyRate: number, periods: number): number => {
  if (monthlyRate <= 0) return balance / periods;

  const factor = Math.pow(1 + monthlyRate, periods);
  return (balance * monthlyRate * factor) / (factor - 1);
};

const getAmortization = ({
  balance,
  financingType,
  fixedAmortization,
  interest,
  priceInstallment,
}: {
  balance: number;
  financingType: string;
  fixedAmortization: number;
  interest: number;
  priceInstallment: number;
}): { amortization: number; installment: number } => {
  if (financingType === 'price') {
    const installment = priceInstallment;
    return {
      amortization: Math.min(Math.max(installment - interest, 0), balance),
      installment,
    };
  }

  const amortization = Math.min(fixedAmortization, balance);
  return {
    amortization,
    installment: amortization + interest,
  };
};

export const calculateFinancing = (financing: FinancingCalculationInput): FinancingCalculationResult => {
  const deadline = Number(financing.deadline);
  const shortage = Number(financing.shortage || 0);
  const amortizationPeriods = Math.max(deadline - shortage, 1);
  const monthlyRate = toMonthlyRate(financing.interest);
  const startDate = moment(financing.date, 'YYYY-MM-DD');
  const rows: DataTableCellImp[] = [];
  let balance = Number(financing.value);

  const priceInstallment = calculatePriceInstallment(balance, monthlyRate, amortizationPeriods);
  const fixedAmortization = balance / amortizationPeriods;

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
      const result = getAmortization({
        balance,
        financingType: financing.type,
        fixedAmortization,
        interest,
        priceInstallment,
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
