import { AxiosInstance } from 'axios';
import http from '../http';
import { MsTypesImp } from '@/interfaces/MsTypesImp';

class BaseService {
  protected abortController: AbortController | null = null;
  protected token = localStorage.getItem('token') as string;
  public axios: AxiosInstance;

  constructor(abortControllerOrMsType?: AbortController | MsTypesImp) {
    const isAbortController = abortControllerOrMsType instanceof AbortController;
    if (isAbortController) this.abortController = abortControllerOrMsType;

    this.axios = http(isAbortController ? undefined : abortControllerOrMsType, undefined, {
      signal: isAbortController ? abortControllerOrMsType.signal : undefined,
    });
  }
}

export default BaseService;
