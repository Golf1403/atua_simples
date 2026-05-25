import { getErrorMessage } from '../../http';
import { ICreditPurchaseRequest, ICreditPurchaseResponse } from '@interfaces/tools/creditPurchase/creditPurchase';
import BaseService from '@/services/http/BaseService';

class CreditPurchaseService extends BaseService {
  creditPurchase = ({ capital, incomingPayment, installments, installmentsValue }: ICreditPurchaseRequest) => {
    return new Promise<ICreditPurchaseResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.post('/tools/credit/purchase', {
          capital,
          incomingPayment,
          installments,
          installmentsValue,
        });
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        response.data.amount = response.data.amount?.replace(/\./, ',');
        response.data.tax = response.data.tax?.replace(/\./, ',');
        const responseData: ICreditPurchaseResponse = response.data;
        resolve(responseData);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}
export default CreditPurchaseService;
