import { getErrorMessage } from '@/services/http';
import BasePrint from '../Base';

export default class CurrentAccountPrint extends BasePrint {
  public printCurrentCalc = (accountId?: string) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const params = { accountId };
        const response = await this.axios.post(
          '/print-current-account',
          undefined,
          accountId?.length ? { params } : undefined
        );

        resolve(response);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
