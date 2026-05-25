import moment from 'moment';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '../http/BaseService';

export default class IndicatorServices extends BaseService {
  public getMinimumWage(date: Date) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const month = moment(date, dateFormatEnum.DEFAULT).format('MM');
        const year = moment(date, dateFormatEnum.DEFAULT).format('YYYY');
        const params = { date: `${year}-${month}-01`, memTabId: 68 };
        const response = await this.axios.get('/accounts/indicadordado', { params });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
