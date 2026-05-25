import { getErrorMessage } from '../../http';
import moment from 'moment';
import { IndicatorResponseImp } from '@interfaces/serviceResponses/IndicatorResponseImp';
import BaseService from '@/services/http/BaseService';
import Law from '@/interfaces/Law';

class IndicatorService extends BaseService {
  public fetchIndicators = ({
    dateEnd,
    dateStart,
    indicatorIds,
  }: {
    indicatorIds: string[];
    dateStart: Date;
    dateEnd: Date;
  }) => {
    return new Promise<IndicatorResponseImp[][]>(async (resolve, reject) => {
      try {
        const startDate = moment(dateStart).set('date', 1).format('YYYY-MM-DD');
        const finalDate = moment(dateEnd).set('date', 1).format('YYYY-MM-DD');

        const config = {
          params: {
            indicadorIds: indicatorIds?.join(','),
            dateStart: startDate,
            dateEnd: finalDate,
          },
        };
        const response = await this.axios.get('/financial-index/indexes/values', config);

        resolve(this.formatResponse(response.data, indicatorIds));
      } catch (error) {
        console.error(error);
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public fetchIndicatorsFromLaw = ({ dateEnd, dateStart, law }: { law: number; dateStart: Date; dateEnd: Date }) => {
    return new Promise<Law[]>(async (resolve, reject) => {
      try {
        const startDate = moment(dateStart).set('date', 1).format('YYYY-MM-DD');
        const finalDate = moment(dateEnd).set('date', 1).format('YYYY-MM-DD');

        const config = {
          params: {
            law,
            dateStart: startDate,
            dateEnd: finalDate,
          },
        };
        const response = await this.axios.get('/financial-index/indexes/values', config);

        resolve(response.data);
      } catch (error) {
        console.error(error);
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public formatResponse = (indexes: IndicatorResponseImp[], indicatorIds: string[]) => {
    const formated: any[] = [];
    indicatorIds.forEach(indicator => {
      formated[Number(indicator)] = indexes.filter(item => {
        return item.index.id.toString() === indicator;
      });
    });

    return formated;
  };
}

export default IndicatorService;
