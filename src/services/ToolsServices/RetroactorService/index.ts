import moment from 'moment';
import { getErrorMessage } from '../../http';
import { replaceCurrencyString } from '@lib/utils';
import { IRetroactorRequest, IRetroactorResponse } from '@interfaces/tools/retroactor';
import BaseService from '@/services/http/BaseService';

class MeasureConverterService extends BaseService {
  public retroactor = (data: IRetroactorRequest) => {
    return new Promise<IRetroactorResponse>(async (resolve, reject) => {
      const from = moment(data.from).set('date', 1).format('YYYY-MM-DD');
      const to = moment(data.to).set('date', 1).format('YYYY-MM-DD');
      let { value } = data;
      const { indexId } = data;
      value = replaceCurrencyString(value);
      try {
        const response = await this.axios.post('/tools/retroactor', { from, to, value, indexId });
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        response.data.result = response.data.result.replace('.', ',');
        const responseData: IRetroactorResponse = response.data;
        resolve(responseData);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}
export default MeasureConverterService;
