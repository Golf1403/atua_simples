import { getErrorMessage } from '../http';
import BaseService from '../http/BaseService';

interface ITerm {}
class TermsService extends BaseService {
  public getUserIp() {
    return new Promise<String>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`users/terms/get-ip`);

        resolve(response.data.ip);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public async getCurrentVersion() {
    return new Promise<{ version: string; acordingTime: string }>(async (resolve, reject) => {
      try {
        const {
          data: [version],
        } = await this.axios.get(`users/terms/latest-version`);

        resolve(version);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public createTerm(newTerm: ITerm) {
    return new Promise<Boolean>(async (resolve, reject) => {
      try {
        const response = await this.axios.post('/users/terms', newTerm);
        resolve(response.data.results);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }
}
export default TermsService;
