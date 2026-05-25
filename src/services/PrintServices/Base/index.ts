import { accountTypeEnum } from '@/enums/accountTypeEnum';
import { pathEnum } from '@/enums/pathEnum';
import AccountImp from '@/interfaces/AccountImp';
import { ConfigurationObjectImp } from '@/interfaces/ConfigurationObjectImp';
import IDummyObject from '@/interfaces/IDummyObject';
import PrintConfigImp from '@/interfaces/PrintConfigImp';
import { AWSS3 } from '@/services/S3';
import { getErrorMessage } from '@/services/http';
import BaseService from '@/services/http/BaseService';
import PrintConfigTransformer from '@/transforms/PrintConfigTransformer';
import axios, { AxiosInstance } from 'axios';

interface CurrentAccountPrintConfig {
  configuration: ConfigurationObjectImp;
}

type SaveConfigPropsImp = PrintConfigImp | CurrentAccountPrintConfig;

export default class BasePrint extends BaseService {
  protected s3: any = new AWSS3();

  public saveDefaultConfig = (config: PrintConfigImp) => {
    localStorage.setItem('defaultPrintConfig', JSON.stringify(PrintConfigTransformer.output(config)));
  };

  public async uploadJSON(
    json: string | Blob,
    filename: string,
    account: AccountImp,
    accountType: accountTypeEnum.CURRENT_ACCOUNT | accountTypeEnum.SIMPLE_UPDATE,
    userId: string
  ) {
    try {
      const octetType = 'application/octet-stream';
      const path = !account.id
        ? `account/${userId}/${accountType}/new`
        : `account/${userId}/${accountType}/${account.id}`;
      const { url } = await this.s3.getKey(octetType, filename, path);
      await this.s3.upload(json, url, octetType);
    } catch (error) {
      console.log(error);
    }
  }

  public getUploadImageUrl = (imageType: string) => {
    return new Promise<{ key: string; url: string }>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/print-financing/config/image-upload', {
          params: { imageType },
        });
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public saveConfig = (
    config: SaveConfigPropsImp,
    type: pathEnum.SIMPLE_UPDATE | pathEnum.CURRENT_ACCOUNT = pathEnum.SIMPLE_UPDATE
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let body;
        switch (type) {
          case pathEnum.SIMPLE_UPDATE:
            body = PrintConfigTransformer.output(config as PrintConfigImp);
            break;
          case pathEnum.CURRENT_ACCOUNT:
            body = config;
            break;
        }
        const response = await this.axios.post(`/print-financing/config`, body);
        resolve(response.data);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public getConfig = (costCenterId?: string | null) => {
    return new Promise<IDummyObject>(async (resolve, reject) => {
      try {
        const response = await this.axios.get('/print-financing/config', {
          params: { costCenterId },
        });
        resolve(response.data.configuration);
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
  public getDefaultConfig = () => {
    const defaultConfig = localStorage.getItem('defaultPrintConfig');
    if (defaultConfig) {
      const parsedConfiguration = JSON.parse(defaultConfig);
      return parsedConfiguration.configuration;
    }
    return '';
  };

  public uploadImage = (file: File, url: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const axiosResponse = axios.create();
        await axiosResponse.put(url, file, { headers: { 'Content-Type': file.type } });
        resolve();
      } catch (error) {
        reject(getErrorMessage(error));
      }
    });
  };
}
