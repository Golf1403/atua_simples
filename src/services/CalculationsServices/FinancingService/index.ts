import { getErrorMessage } from '../../http';
import moment from 'moment';
import FinancingImp from '@interfaces/calculations/FinancingImp';
import FinancingResponseImp from '@interfaces/serviceResponses/FinancingResponseImp';
import financingRequestSchema from '@/validators/calculations/financingRequestSchema';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '@/services/http/BaseService';
import { DataTableCellImp } from '@/interfaces/DataTableImp';

type FinancingPayload = {
  deadline: number;
  interest: string;
  name: string;
  type: string;
  value: number;
  date: string;
  shortage?: number;
  index?: string;
  positive: boolean;
};

type FinancingTotals = {
  amortization: number;
  correction: number;
  installment: number;
  interest: number;
  sum: number;
};

const isLocalUnauthorizedOrNetworkError = (error: any): boolean => {
  const isLocalhost = window.location.hostname === 'localhost';
  const status = error?.response?.status || error?.status;
  return isLocalhost && (!status || status === 401 || error?.code === 'ERR_NETWORK');
};

const shouldUseLocalCalculation = (): boolean => {
  return window.location.hostname === 'localhost' && !localStorage.getItem('token');
};

const getMonthlyRate = (interest: string): number => {
  const numericInterest = Number(String(interest).replace(',', '.')) || 0;
  return numericInterest / 100;
};

const createTotals = (installments: DataTableCellImp[]): FinancingTotals => {
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

const calculateLocalFinancing = (financing: FinancingPayload): FinancingResponseImp => {
  const deadline = Number(financing.deadline);
  const shortage = Number(financing.shortage || 0);
  const amortizationPeriods = Math.max(deadline - shortage, 1);
  const monthlyRate = getMonthlyRate(financing.interest);
  const startDate = moment(financing.date, 'YYYY-MM-DD');
  let balance = Number(financing.value);
  const rows: DataTableCellImp[] = [];

  const priceInstallment =
    monthlyRate > 0
      ? (balance * (monthlyRate * Math.pow(1 + monthlyRate, amortizationPeriods))) /
        (Math.pow(1 + monthlyRate, amortizationPeriods) - 1)
      : balance / amortizationPeriods;

  const sacAmortization = balance / amortizationPeriods;

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
      if (financing.type === 'price') {
        installment = priceInstallment;
        amortization = Math.min(Math.max(installment - interest, 0), balance);
      } else {
        amortization = Math.min(sacAmortization, balance);
        installment = amortization + interest;
      }
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
    order: 'asc',
    orderBy: '',
    page: 1,
    search: '',
    total: createTotals(rows),
  };
};

class FinancingService extends BaseService {
  public calculate = (financing: FinancingImp) => {
    return new Promise<FinancingResponseImp>(async (resolve, reject) => {
      const payload: FinancingPayload = {
        deadline: financing.deadline,
        interest: financing.interest,
        name: financing.name,
        type: financing.type,
        value: financing.value,
        date: moment(financing.date, dateFormatEnum.DEFAULT).format('YYYY-MM-DD'),
        positive: financing.positive,
      };

      try {
        if (financing.index && financing.index !== String(-1)) payload.index = financing.index;

        if (financing.shortage) payload.shortage = financing.shortage;

        const body = await financingRequestSchema.validate(payload);
        if (shouldUseLocalCalculation()) {
          resolve(calculateLocalFinancing(payload));
          return;
        }

        const response = await this.axios.post('/accounts/financing', body);
        resolve(response.data);
      } catch (error) {
        if (isLocalUnauthorizedOrNetworkError(error)) {
          resolve(calculateLocalFinancing(payload));
          return;
        }

        reject(getErrorMessage(error));
      }
    });
  };
}
export default FinancingService;
