import { getErrorMessage } from '../../http';
import moment from 'moment';
import FinancingImp from '@interfaces/calculations/FinancingImp';
import FinancingResponseImp from '@interfaces/serviceResponses/FinancingResponseImp';
import financingRequestSchema from '@/validators/calculations/financingRequestSchema';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '@/services/http/BaseService';

class FinancingService extends BaseService {
  public calculate = (financing: FinancingImp) => {
    return new Promise<FinancingResponseImp>(async (resolve, reject) => {
      try {
        const payload: {
          deadline: number;
          interest: string;
          name: string;
          type: string;
          value: number;
          date: string;
          shortage?: number;
          index?: string;
          positive: boolean;
        } = {
          deadline: financing.deadline,
          interest: financing.interest,
          name: financing.name,
          type: financing.type,
          value: financing.value,
          date: moment(financing.date, dateFormatEnum.DEFAULT).format('YYYY-MM-DD'),
          positive: financing.positive,
        };

        if (financing.index) payload.index = financing.index;

        if (financing.shortage) payload.shortage = financing.shortage;

        const body = await financingRequestSchema.validate(payload);
        const response = await this.axios.post('/accounts/financing', body);
        resolve(response.data);
      } catch (error) {
        console.log(error);
        reject(getErrorMessage(error));
      }
    });
  };
}
export default FinancingService;
