import { getErrorMessage } from '@services/http';

export default class ErrorTransformer {
  public static output(error: any) {
    return getErrorMessage({ response: { data: error } });
  }
}
