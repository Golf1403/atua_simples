import UpdateBillingDataImp from '@interfaces/UpdateBillingDataImp';
import UpdateLicenseDataImp from '@interfaces/UpdateLicenseDataImp';
import IAccessProfileResponse from '@interfaces/serviceResponses/AccessProfileResponseImp';
import IPaymentMethodResponse from '@interfaces/serviceResponses/PaymentMethodResponseImp';
import IUserProfileResponse, { ProfileImp, TaxDataImp } from '@interfaces/serviceResponses/UserProfileResponseImp';
import ListUserTransformer from '../../transforms/ListUserTransformer';
import { getErrorMessage } from '../http';

import { ListUsersResponseImp } from '@interfaces/serviceResponses/UserAdminResponseImp';
import UserResponseImp from '@interfaces/serviceResponses/UserResponseImp';
import { removeTraceAndDot } from '@lib/utils';
import { getWitchEnv } from '../../utils/getWitchEnv';
import BaseService from '../http/BaseService';
import { UserImp } from '@/hooks/user';

interface ILicense {
  id: string;
  licenseId: string;
  suspendedAt: string;
  licensePayment?: any;
  user?: UserImp;
}

class UserServices extends BaseService {
  protected isProdMode: boolean = getWitchEnv();

  public checkEmail(email: string) {
    return new Promise<{
      msg: string;
      user: UserImp | null;
    }>(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`/users/check-email`, { email });

        resolve(response.data);
      } catch (error) {
        reject(error?.response?.status);
      }
    });
  }

  public listUsers() {
    return new Promise<ListUsersResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/users/license/associated`);
        const result = ListUserTransformer.output(response.data);

        resolve(result);
      } catch (error) {
        console.log(error);
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public restoreUser(email: string) {
    return new Promise<ILicense>(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`/users/profile/recovery`, { email });

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public saveUserByMasterUser(user: UserImp) {
    return new Promise<UserImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`/users/license/master-register/associate`, user);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public showUser(userId: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/users/${userId}`);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public saveUser(user: Omit<UserImp, 'id'>) {
    return new Promise<UserImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`users/license/register`, user);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public async updateCompleteUser(user: UserImp) {
    return new Promise<UserResponseImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.put(`/users/${user.licenseId}`, user);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public listAccessProfiles() {
    return new Promise<IAccessProfileResponse[]>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/users/profiles');
        resolve(response.data.results);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public removeCompleteProfile(userId: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.axios.delete(`/users/profile/${userId}`);

        resolve();
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public getCompleteProfile() {
    return new Promise<IUserProfileResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/users/profile`, {
          params: { licenseId: '' },
        });

        if (response.data.error || response.data.errors) throw new Error(response.data);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public updateCompleteProfile(profileData: ProfileImp) {
    return new Promise<UserImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.put(`/users/profile/${profileData.id}`, profileData, {
          params: { licenseId: '' },
        });

        if (response.data.error || response.data.errors) throw new Error(response.data);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public updateTaxData(id: string | number, taxData: TaxDataImp) {
    taxData.phone1 = removeTraceAndDot(taxData.phone1);
    taxData.phone2 = removeTraceAndDot(taxData.phone2);
    taxData.zipcode = removeTraceAndDot(taxData.zipcode);

    return new Promise<IUserProfileResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.put(
          `/users/${id}`,
          { taxData },
          {
            params: { licenseId: '' },
          }
        );

        if (response.data.error || response.data.errors) throw new Error(response.data);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public updateUserLicense(updateData: UpdateLicenseDataImp) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`/users/change-license`, updateData, {
          params: { licenseId: '' },
        });

        if (response.data.error || response.data.errors) throw new Error(response.data);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }
}
export default UserServices;
