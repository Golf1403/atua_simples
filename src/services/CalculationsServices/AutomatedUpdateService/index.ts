import AutomatedUpdateAccountImp from '@/interfaces/calculations/AutomatedUpdateAccountImp';
import BaseService from '@/services/http/BaseService';
import { getErrorMessage } from '@/services/http';

const resourcePath = '/v1/automated-update-accounts';

// Servico HTTP da Atualizacao Automatizada. Centraliza os caminhos usados pelo
// microservico local e pelo handler serverless em desenvolvimento.
class AutomatedUpdateService extends BaseService {
  constructor() {
    super('automatedUpdate');
  }

  public listAccounts = (costCenterIds?: string[]) => {
    return new Promise<AutomatedUpdateAccountImp[]>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(resourcePath, {
          params: {
            costCenterIds: costCenterIds?.join(','),
          },
        });
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public showAccount = (accountId: string) => {
    return new Promise<AutomatedUpdateAccountImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`${resourcePath}/${accountId}`);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public saveAccount = (account: AutomatedUpdateAccountImp) => {
    return new Promise<AutomatedUpdateAccountImp>(async (resolve, reject) => {
      try {
        const response = account.id
          ? await this.axios.put(`${resourcePath}/${account.id}`, account)
          : await this.axios.post(resourcePath, account);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public deleteAccount = (accountId: string) => {
    return new Promise<AutomatedUpdateAccountImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.delete(`${resourcePath}/${accountId}`);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public calculateAccount = (accountId: string) => {
    return new Promise<AutomatedUpdateAccountImp>(async (resolve, reject) => {
      try {
        const response = await this.axios.get(`${resourcePath}/${accountId}/calculation`);
        resolve(response.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };
}

export default AutomatedUpdateService;
