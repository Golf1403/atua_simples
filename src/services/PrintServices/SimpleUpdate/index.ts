import { getErrorMessage } from '@/services/http';
import BasePrint from '../Base';
import axios from 'axios';

export default class SimpleUpdatePrint extends BasePrint {
  public printSimpleCalc = (accountId?: string) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const params = { accountId };
        const response = await this.axios.post(
          '/print-simple-update',
          undefined,
          accountId?.length ? { params } : undefined
        );

        resolve(response);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };

  public printSimpleCalcByMock = () => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const response = await axios.get('http://localhost:8081/prints-simple/dev/mock');

        resolve(response);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
