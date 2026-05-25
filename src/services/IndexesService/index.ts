import moment from 'moment';
import { getErrorMessage } from '@services/http';
import MemCalcImp from '@interfaces/MemCalcImp';
import CalculationMemoryResponseImp from '@interfaces/serviceResponses/CalculationMemoryResponseImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import IndicatorService from '@services/ToolsServices/IndicatorService';
import PurgeItemImp from '@interfaces/calculations/PurgeItemImp';
import { IGetMemCalcsWithFactors, IGetMemCalcsWithFactorsReponse } from '@services/MonetaryCorrectionService/interface';
import IAccount from '@interfaces/AccountImp';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import BaseService from '@/services/http/BaseService';

export interface GetMemCaclcsReponseImp {
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp | null;
}
export default class IndexesService extends BaseService {
  protected calculationsMemory: CalculationMemoryResponseImp[] = [];
  protected purgesCalculated: PurgeItemImp[] = [];
  protected coinConversions: number[] = [];
  protected purgesApplied: PurgeItemImp[] = [];

  protected account?: IAccount;

  public getTransitiveInterestWithOutSelectIndex = () => {
    return new Promise<InterestIndexesImp>(async (resolve, reject) => {
      try {
        const dateStartDate = moment('01/01/1964', dateFormatEnum.DEFAULT).toDate();
        const dateEndDate = moment(new Date()).toDate();

        const savingsId = '61';
        const newSavingsDailyId = '62';
        const newSavingsId = '100';
        const selicId = '73';
        const trId = '52';

        const indexesResponse = await new IndicatorService().fetchIndicators({
          indicatorIds: [savingsId, selicId, trId, newSavingsId, newSavingsDailyId],
          dateStart: dateStartDate,
          dateEnd: dateEndDate,
        });

        const interestIndexes: InterestIndexesImp = {
          selic: indexesResponse[+selicId],
          savings: indexesResponse[+savingsId],
          tr: indexesResponse[+trId],
          newSavings: indexesResponse[+newSavingsId],
          newSavingsDaily: indexesResponse[+newSavingsDailyId],
        };
        resolve(interestIndexes);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public getMemCalcs = (date: string | Date, updateTo: string | Date, indexId: number) => {
    return new Promise<GetMemCaclcsReponseImp>(async (resolve, reject) => {
      try {
        const memCalcs = await this.axios.get('/financial-index/memcalc', {
          params: {
            date,
            indexId,
            updateTo,
          },
        });

        const interestIndexes: InterestIndexesImp | null = null;

        resolve({ memCalcs: memCalcs.data, interestIndexes });
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public resetTransitiveIndex = (type: 'get' | 'put') => {
    return new Promise<{ isReset: boolean }>(async (resolve, reject) => {
      try {
        const { data } = await this.axios.get('/financial-index/interest/reset', {
          params: {
            type,
          },
        });

        resolve(data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  };

  public getMemCalcWithIndexValue(date: string | Date, updateTo: string | Date, indexId: number) {
    return new Promise<MemCalcImp[]>(async (resolve, reject) => {
      try {
        const memCalcs = await this.axios.get<MemCalcImp[]>('/financial-index/memcalc', {
          params: {
            date,
            indexId,
          },
        });

        const memCalcsWithIndexValues = await this.axios.post<MemCalcImp[]>('/financial-index/memcalc', {
          memCalcs: memCalcs.data,
        });

        resolve(memCalcsWithIndexValues.data);
      } catch (error) {
        reject({ msg: getErrorMessage(error), status: error?.response?.status || 400 });
      }
    });
  }

  public async getFactors(params: IGetMemCalcsWithFactors): Promise<IGetMemCalcsWithFactorsReponse> {
    let memCalcs: MemCalcImp[] = params.memCalcs || [];
    if (!params.account?.indexId) throw new Error();
    if (!memCalcs.length)
      memCalcs = (
        await this.getMemCalcs('1964-01-01', moment(new Date()).format('YYYY-MM-DD'), Number(params.account?.indexId))
      ).memCalcs;
    params.memCalcs = memCalcs;

    const { data: response } = await this.axios.post('/financial-index/recalculate/correction-monetary', params);

    return {
      factorsPositive: response.indicadorDado,
      factorsNegative: response.indicadorDadoNegative,
      detailedPositive: response.detailed,
      detailedNegative: response.detailedNegative,
      memCalcs,
    };
  }
}
