import { getErrorMessage } from '../../http';
import { replaceCurrencyString } from '@lib/utils';
import { ICurrencyConverterResponse, ICurrencyConverterRequest } from '@interfaces/tools/currency/ICurrencyConverter';
import BaseService from '@/services/http/BaseService';

class CurrencyConverterService extends BaseService {
  public currencyConverter = (data: ICurrencyConverterRequest) => {
    return new Promise<ICurrencyConverterResponse>(async (resolve, reject) => {
      const { from, to } = data;
      let { value } = data;
      value = replaceCurrencyString(value);

      try {
        const response = await this.axios.post('/tools/converter/currency', {
          from,
          to,
          value,
        });

        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        const responseData: ICurrencyConverterResponse = response.data;

        resolve(responseData);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}

export default CurrencyConverterService;
