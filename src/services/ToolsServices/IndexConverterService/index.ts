import { getErrorMessage } from '../../http';
import { replaceCurrencyString } from '@lib/utils';
import { IIndexConverterResponse, IIndexConverterRequest } from '@interfaces/tools/indexConverter/IIndexConverter';
import BaseService from '@/services/http/BaseService';

class IndexConverterService extends BaseService {
  public indexConverter = ({ date, index, indexId, value }: IIndexConverterRequest) => {
    return new Promise<IIndexConverterResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.post('/tools/converter/index', {
          date,
          index,
          indexId,
          value,
        });

        response.data.result = response.data.result?.replace(/\./, ',');
        const responseData: IIndexConverterResponse = response.data;

        resolve(responseData);
      } catch (error) {
        const errorAny: any = error;
        reject({ msg: getErrorMessage(error), status: errorAny?.response?.status || 400 });
      }
    });
  };
}
export default IndexConverterService;
