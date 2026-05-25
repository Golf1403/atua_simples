import { AxiosInstance } from 'axios';
import http from '../http';

class BaseService {
  protected abortController: AbortController | null = null;
  protected token = localStorage.getItem('token') as string;
  public axios: AxiosInstance;

  constructor(abortController?: AbortController) {
    if (abortController) this.abortController = abortController;
    this.axios = http(undefined, undefined, { signal: abortController?.signal });
  }
}

export default BaseService;
