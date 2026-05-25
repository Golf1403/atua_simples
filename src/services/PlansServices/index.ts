import { getErrorMessage } from '../http';
import FrequencyImp from '@interfaces/plans/FrequencyImp';
import { IFrequencies } from '@store/plans/types';
import { planFrequencySerializer, planFrequenciesSerializer } from '../../serializers/plans';
import BaseService from '../http/BaseService';

class PlansServices extends BaseService {
  public plansFrequencies = () => {
    return new Promise<IFrequencies>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/plans/frequencies');
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        const parseData = planFrequenciesSerializer(response.data);
        resolve(parseData);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public frequencyDetail = (frequencyId: string) => {
    return new Promise<FrequencyImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/plans/frequency/${frequencyId}`);
        if (response.data.error || response.data.errors) {
          throw new Error(response.data);
        }
        const parseData = planFrequencySerializer(response.data, frequencyId);
        resolve(parseData);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
export default PlansServices;
