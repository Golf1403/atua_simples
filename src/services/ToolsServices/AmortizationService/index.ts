import { getErrorMessage } from '../../http';
import { IAmortizationRequest, IAmortizationResponse } from '@interfaces/tools/amortization';
import { replaceCurrencyString } from '@lib/utils';
import BaseService from '@/services/http/BaseService';

interface IBody {
  capital?: string;
  tax?: string;
  installments?: string;
  installmentsValue?: string;
  amount?: string;
}

class AmortizationService extends BaseService {
  protected params: any;
  run = ({ capital, tax, installments, installmentsValue, amount }: IAmortizationRequest) => {
    return new Promise<IAmortizationResponse>(async (resolve, reject) => {
      const body: IBody = {};

      if (capital) body.capital = capital;
      if (tax) body.tax = tax;
      if (installments) body.installments = installments;
      if (installmentsValue) body.installmentsValue = installmentsValue;
      if (amount) body.amount = amount;

      try {
        const response = await this.axios.post('/tools/amortization', body, { params: this.params });

        if (response.data.error || response.data.errors) throw new Error(response.data);

        response.data.capital = response.data.capital?.replace(/\./, ',');
        response.data.tax = response.data.tax?.replace(/\./, ',');
        response.data.installments = response.data.installments?.replace(/\./, ',');
        response.data.installmentsValue = response.data.installmentsValue?.replace(/\./, ',');
        response.data.amount = response.data.amount?.replace(/\./, ',');
        response.data.installmentsTotal = response.data.installmentsTotal?.replace(/\./, ',');
        const responseData: IAmortizationResponse = response.data;
        resolve(responseData);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}
export default AmortizationService;
