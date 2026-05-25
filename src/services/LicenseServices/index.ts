import { getErrorMessage } from '../http';
import LicenseInfoResponseImp from '@interfaces/serviceResponses/LicenseInfoResponseImp';
import PaymentLogsResponseImp from '@interfaces/serviceResponses/PaymentLogsResponseImp';
import { ListCouponResponseImp } from '@interfaces/serviceResponses/ListCouponResponseImp';
import BaseService from '../http/BaseService';

export default class LicenseService extends BaseService {
  public getUserLicense = () => {
    return new Promise<LicenseInfoResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/licenses');
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public listCoupons = () => {
    return new Promise<ListCouponResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`licenses/vouchers`);
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public fetchPaymentLogs = (page = 1, search = '', orderBy = 'date', order = 'asc') => {
    return new Promise<PaymentLogsResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/licenses/transactions`, { params: { page, search, orderBy, order } });
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
