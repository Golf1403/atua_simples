import moment from 'moment';
import MemCalcImp from '@interfaces/MemCalcImp';
import CalculationMemoryResponseImp from '@interfaces/serviceResponses/CalculationMemoryResponseImp';
import InterestIndexesImp from '@interfaces/calculations/InterestIndexesImp';
import PurgeItemImp from '@interfaces/calculations/PurgeItemImp';
import IAccount from '@interfaces/AccountImp';
import CorrectionImp, { MonetaryCorrectionCalculateImp } from '@interfaces/calculations/CorrectionImp';
import { getCoin, roundNumber } from '../../utils/numberUtils';
import { dateFormatEnum } from '@/enums/DateFormatEnum';
import { doConversion } from '@/utils/conversionHelper';
import { indexDeflation } from '@/data/generalData/indexNegativeRadioOptions';
import BaseService from './BaseService';
import ProRataDiaService from './ProRataDiaService';

export interface GetMemCaclcsReponseImp {
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp | null;
}
export default class MonetaryCorrectionService {
  protected calculationsMemory: CalculationMemoryResponseImp[] = [];
  protected purgesCalculated: PurgeItemImp[] = [];
  protected coinConversions: number[] = [];
  protected purgesApplied: PurgeItemImp[] = [];
  protected account?: IAccount;
  protected baseService = new BaseService();
  protected proRataDiaService = new ProRataDiaService();

  protected getCalculationMemory() {
    const calculationMemory: {
      startDate: Date | string;
      descriptions: string[];
    } = { startDate: '', descriptions: [] };
    let currentIndexName = '';

    for (let i = 0; i < this.calculationsMemory?.length; i++) {
      const calculation = this.calculationsMemory[i];

      if (currentIndexName === calculation.memCalc.mecnome) return calculationMemory;

      currentIndexName = calculation.memCalc.mecnome;

      if (!calculationMemory.startDate || moment(calculation.start).isBefore(calculationMemory.startDate))
        calculationMemory.startDate = calculation.start;

      const start = moment(calculation.start).utc().locale('pt-br');
      const end = moment(calculation.end).utc().locale('pt-br');
      const startDateText = `de ${start.format('MMMM')} de ${start.format('YYYY')}`;
      const endDateText = `até ${end.format('MMMM')} de ${end.format('YYYY')}`;
      const isTheLastCalculationMemory = i === this.calculationsMemory.length - 1;
      let description = `${currentIndexName} ${startDateText} ${endDateText}`;

      if (calculation.memCalc.indicador.indlei && isTheLastCalculationMemory)
        description += ` (${calculation.memCalc.indicador.indlei})`;

      calculationMemory.descriptions.push(description);
    }

    if (this.purgesCalculated) {
      for (const purge of this.purgesApplied) {
        const start = moment(purge.date).utc().locale('pt-br');

        const startDateText = `em ${start.format('MMMM')} de ${start.format('YYYY')}`;

        calculationMemory.descriptions.push(
          `IPC ${startDateText} = ${purge.value}% [diferença expurgada ${Number(purge.diff).toFixed(2)}]`
        );
      }
    }

    return calculationMemory;
  }

  public calculate(params: MonetaryCorrectionCalculateImp): CorrectionImp {
    try {
      this.account = params.account;
      this.calculationsMemory = [];
      if (this.account?.purges?.length) this.purgesApplied = this.account.purges;

      const startDate = moment(params.date, dateFormatEnum.DEFAULT);
      const endDate = moment(this.account.updateTo, dateFormatEnum.DEFAULT);

      if (startDate.isAfter(endDate))
        return {
          calculationMemory: this.getCalculationMemory(),
          value: roundNumber(0, 2),
          correctedCoin: getCoin(endDate.format(dateFormatEnum.DEFAULT), 0),
          inputCoin: getCoin(startDate.format(dateFormatEnum.DEFAULT), 0),
          details: [],
        };

      const startDay = Number(startDate.format('DD'));
      const endDay = Number(endDate.format('DD'));

      const isProRataDay = (startDay != 1 || endDay != 1) && params.account.proRataDay;

      const type: 'proRataDiaService' | 'baseService' = isProRataDay ? 'proRataDiaService' : 'baseService';

      const { indicadorDado: indicadorDadoArray, detailed } = this[type].calculateFactors(params);

      const indicadorDadoMap: Map<string, number> = new Map(indicadorDadoArray || []);

      const memCalcsLength = params.memCalcs.length;

      const firstMemCalc = memCalcsLength ? params.memCalcs[0] : undefined;
      const biggerDateOfMemCalc = memCalcsLength
        ? moment(firstMemCalc?.mecenda, 'YYYY-MM-DD').format('YYYY-MM-DD')
        : endDate.format('YYYY-MM-DD');

      const lastMemCalc = memCalcsLength ? params.memCalcs[memCalcsLength - 1] : undefined;
      const smallerDateOfMemCalc = memCalcsLength
        ? moment(lastMemCalc?.mecenda, 'YYYY-MM-DD').format('YYYY-MM-DD')
        : startDate.format('YYYY-MM-DD');

      let biggerDate = moment(biggerDateOfMemCalc, 'YYYY-MM-DD');
      let smallerDate = moment(smallerDateOfMemCalc, 'YYYY-MM-DD');

      const factorsDate = Array.from(indicadorDadoMap).map(([name]) => name);

      const firstFactorDate = factorsDate[0];
      const lastFactorDate = factorsDate[factorsDate.length - 1];

      if (factorsDate?.length) {
        smallerDate = moment(firstFactorDate, dateFormatEnum.DEFAULT);
        biggerDate = moment(lastFactorDate, dateFormatEnum.DEFAULT);
      }

      if (startDate.isSameOrAfter(smallerDate)) smallerDate = startDate;
      if (startDate.isAfter(endDate)) smallerDate = endDate;
      if (smallerDate.isAfter(endDate)) smallerDate = endDate;

      if (endDate.isSameOrBefore(biggerDate)) biggerDate = endDate;
      if (endDate.isBefore(smallerDate)) biggerDate = smallerDate;
      if (biggerDate.isBefore(smallerDate)) biggerDate = smallerDate;

      const endDateString = biggerDate.format(dateFormatEnum.ONE_DAY);
      const startDateString = startDate.format(dateFormatEnum.ONE_DAY);

      const initialFactor =
        this.account.indexId == -1 || isProRataDay ? 10000 : indicadorDadoMap.get(startDateString) || 10000;
      const endFactor = this.account.indexId == -1 ? 10000 : indicadorDadoMap.get(endDateString) || 10000;

      let correctedValue = params.value;

      correctedValue = (correctedValue / initialFactor) * endFactor;

      if (startDate.isSameOrAfter(endDate)) correctedValue = params.value;
      if (endDate.isSameOrBefore(startDate)) correctedValue = params.value;

      if (this.account.indexId == -1) correctedValue = doConversion(correctedValue, startDateString, endDateString);

      if (correctedValue < params.value && this.account.deflation?.includes(indexDeflation.id))
        correctedValue = params.value;

      const response: CorrectionImp = {
        calculationMemory: this.getCalculationMemory(),
        value: roundNumber(correctedValue, 2),
        correctedCoin: getCoin(endDate.format(dateFormatEnum.DEFAULT), 0),
        inputCoin: getCoin(startDate.format(dateFormatEnum.DEFAULT), 0),
        details: detailed,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}
