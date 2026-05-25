import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
import Dictionary from '@services/DictionaryServices';

import { getMsToBeUsed } from '../../utils/getMsToBeUsed';

import { MsTypesImp } from '@interfaces/MsTypesImp';
import logout from './logout';
import getTokens from './getTokens';

export default (msType?: MsTypesImp, baseUrl?: string, requestConfig?: AxiosRequestConfig) => {
  const authorizationInterceptor: any = async (config: AxiosRequestConfig) => {
    config.params = {
      ...config.params,
      Source: process.env.REACT_APP_ENV.includes('qa') ? 'sei-spa-qa' : 'sei-spa',
    };

    if (!config.headers?.Authorization) {
      const { token } = getTokens();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  };

  const defaultConfig: AxiosRequestConfig = {
    ...requestConfig,
    timeout: 60000 * 4,
    baseURL: baseUrl ? baseUrl : getMsToBeUsed(msType),
  };
  const instance = axios.create(defaultConfig);

  instance.interceptors.request.use(authorizationInterceptor);
  instance.interceptors.response.use(
    response => {
      if (response.status === HttpStatusCode.Unauthorized) logout();
      return response;
    },
    error => {
      if (error.config && error.response && error.response.status === HttpStatusCode.InternalServerError) {
        const config = error.config;
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount < 3) {
          config.__retryCount += 1;
          return new Promise(resolve => {
            setTimeout(() => resolve(instance(config)), 1000);
          });
        }
      }

      const status = error?.response?.status || error?.status;

      if (status && status === HttpStatusCode.Unauthorized) logout();
      else if (error.request) {
        const requestDone = error.request.readyState >= 3;
        if (requestDone) console.error('Requisição abortada');

        return Promise.reject(error);
      } else {
        console.error('Erro durante a configuração da requisição');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const getErrorMessage = ({ response }: any): string => {
  const dictionary = new Dictionary('pt-br');

  if (response?.data?.validationErrors) {
    const values = Object.values(response?.data?.validationErrors);
    let error = '';

    values.forEach(value => (error += `${dictionary.translate(String(value).trim())}\n`));

    return error;
  }

  if (response?.data?.message) return dictionary.translate(String(response.data.message).trim());

  return 'Falha na conexão, tente novamente mais tarde';
};
