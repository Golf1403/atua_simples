import { getErrorMessage } from '../http';
import AddressResponseImp from '@interfaces/serviceResponses/AddressResponseImp';
import { AxiosInstance } from 'axios';
import BaseService from '../http/BaseService';

class AddressServices extends BaseService {
  public getZipcode = (zipcode: string) => {
    return new Promise<AddressResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/address/zipcode/${zipcode}`);
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
export default AddressServices;
