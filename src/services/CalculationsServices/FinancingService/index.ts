import { getErrorMessage } from '../../http';
import moment from 'moment';
import FinancingImp from '@interfaces/calculations/FinancingImp';
import FinancingResponseImp from '@interfaces/serviceResponses/FinancingResponseImp';
import financingRequestSchema from '@/validators/calculations/financingRequestSchema';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '@/services/http/BaseService';
import { calculateFinancing } from '@/domains/financing';

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

const isLocalUnauthorizedOrNetworkError = (error: any): boolean => {
  const isLocalhost = window.location.hostname === 'localhost';
  const status = error?.response?.status || error?.status;
  return isLocalhost && (!status || status === 401 || error?.code === 'ERR_NETWORK');
};

const shouldUseLocalCalculation = (): boolean => {
  return window.location.hostname === 'localhost' && !localStorage.getItem('token');
};

const calculateLocalFinancing = (financing: FinancingPayload): FinancingResponseImp => {
  const result = calculateFinancing(financing);

  return {
    installments: result.installments,
    order: 'asc',
    orderBy: '',
    page: 1,
    search: '',
    total: result.total,
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
