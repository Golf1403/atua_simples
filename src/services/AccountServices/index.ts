import IAccount from '@interfaces/AccountImp';
import NomenclatureImp from '@interfaces/NomenclatureImp';
import CostCenterImp, { UpdateCostCenterImp } from '@interfaces/costCenters/CostCenterImp';
import IAccountResponse from '@interfaces/serviceResponses/AccountResponseImp';
import IDashboardResponse from '@interfaces/serviceResponses/DashboardResponseImp';

import AccountImp from '@interfaces/AccountImp';
import { CurrentAccoutImp, SimpleAccountImp } from '@interfaces/SimpleAccountImp';
import ICalculationsResponse from '@interfaces/serviceResponses/CalculationsResponseImp';
import { IndexQueryRequestImp, IndexResponseImp } from '@interfaces/serviceResponses/IndexResponseImp';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import currentAccountSchema from '../../validators/calculations/currentAccount/currentAccountSchema';
import simpleUpdateSchema from '../../validators/calculations/simpleUpdate/simpleUpdateSchema';
import worker_script from '../../workersweb/compress';
import { getErrorMessage } from '../http';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '../http/BaseService';
import { messagesEnum } from '@/enums/messagesEnum';

export interface ICostCenterInfo {
  users: {
    list: {
      id: string;
      acording: number;
      active: number;
      master: number;
      email: string;
      firstName: string;
      knownAs: null;
      lastName: string;
      taxDataId: number;
      treatment: string;
      updatedAt: string;
      createdAt: string;
    }[];
    total: number;
  };
  accounts: {
    total: number;
  };
}

export interface ListAccountsByTypeIdImp {
  accountTypeId: number;
  orderBy?: string;
  order?: string;
  page?: number;
  search?: string;
}

class AccountServices extends BaseService {
  public fetchNewSavings = (dateStart: string, dateEnd: string) => {
    return new Promise<any[]>(async (resolve, reject) => {
      try {
        const config = {
          params: {
            dateStart,
            dateEnd,
          },
        };
        const response = await this.axios.get('financial-index/indexes/new-savings', config);
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  };

  public getCostCenterInfo({
    costCenterId,
    dateStart,
    dateEnd,
  }: {
    costCenterId: string;
    dateStart: string;
    dateEnd: string;
  }) {
    return new Promise<ICostCenterInfo>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(
          `accounts/cost-centers/info?costCenterId=${costCenterId}&dateStart=${dateStart}&dateEnd=${dateEnd}`
        );

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public getDashboard() {
    return new Promise<IDashboardResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/accounts/dashboard`);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public saveAccount = (payload: SimpleAccountImp | CurrentAccoutImp) => {
    return new Promise<AccountImp>(async (resolve, reject) => {
      try {
        let values: any;
        const { account } = payload;
        switch (payload.account.accountTypeId) {
          case 1:
            values = await simpleUpdateSchema.validate(payload);
            break;
          case 3:
            values = await currentAccountSchema.validate(payload);
            break;
        }

        const worker = new Worker(worker_script);
        worker.postMessage({ type: 'compress', data: JSON.stringify(values) });
        const axios = this.axios;

        worker.addEventListener('message', async function (event) {
          if (event.data.type === 'compressed') {
            try {
              let response: AxiosResponse;
              const dataBase64compressed = event.data.data;
              const body = {
                ...account,
                indexId: `${account.indexId}`,
                updateTo: moment(account.updateTo, dateFormatEnum.DEFAULT).toDate(),
                data: dataBase64compressed,
              };
              console.info(`${(Buffer.byteLength(event.data.data) / 1000000).toFixed(2)} mb`);

              if (account.id) {
                body.id = account.id;
                response = await axios.put(`/accounts/${account.id}`, body);
              } else response = await axios.post(`/accounts`, body);

              resolve(response.data);
            } catch (error) {
              console.log(error);
              reject({ msg: getErrorMessage(error) });
            } finally {
              worker.terminate();
            }
          }
        });
      } catch (error) {
        console.log(error);
        reject({ msg: error?.message || messagesEnum.ACCOUNT_SAVE_ERROR });
      }
    });
  };

  public listAccountsByTypeId = (payload: ListAccountsByTypeIdImp) => {
    return new Promise<ICalculationsResponse>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/accounts', {
          params: payload,
        });
        resolve(response.data as ICalculationsResponse);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public showAccount = (accountId: string) => {
    return new Promise<IAccount>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/accounts/${accountId}`);
        const account: IAccount = {
          ...response.data,
          updateTo: moment(response.data.updateTo, 'YYYY-MM-DD').format(dateFormatEnum.DEFAULT),
        };
        resolve(account);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public deleteAccount = (accountId: string) => {
    return new Promise<IAccountResponse>(async (resolve, reject) => {
      try {
        const deleted = await this.axios.delete(`/accounts/${accountId}`);
        resolve(deleted.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public listCostCenter = () => {
    return new Promise<CostCenterImp[]>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/accounts/cost-centers`);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public updateCostCenter = (costCenter: CostCenterImp) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await this.axios.put(`/accounts/cost-centers/${costCenter.id}`, costCenter);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public saveCostCenter = (costCenter: CostCenterImp) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await this.axios.post(`/accounts/cost-centers/user/associate`, costCenter);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public deleteCostCenter = (costCenterId: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const response = await this.axios.delete(`/accounts/cost-centers/user/disassociate/${costCenterId}`);

        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public listIndexes = (params?: IndexQueryRequestImp) => {
    return new Promise<IndexResponseImp[]>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/financial-index/indexes?page=-1`, {
          params,
        });
        resolve(response.data.results);
      } catch (error) {
        reject(error);
      }
    });
  };

  public listNomenclatures = (costCenterId: string) => {
    return new Promise<NomenclatureImp[]>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`/accounts/nomenclatures`, {
          params: { costCenterId },
        });
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public associateNomenclatures = (costCenterId: string, data: NomenclatureImp[]) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const nomenclatures = data.map(item => {
          return { nomenclatureId: item.id, value: item.value || item.default_value };
        });
        const response = await this.axios.post(`/accounts/nomenclatures/${costCenterId}`, nomenclatures);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}

export default AccountServices;
