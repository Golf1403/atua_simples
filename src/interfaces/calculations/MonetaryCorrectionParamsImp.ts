import IndicadorDadoHasMemTabImp from '../IndicadorDadoHasMemTabImp';
import MemCalcImp from '../MemCalcImp';
import PurgeItemImp from './PurgeItemImp';

export interface AdministrativeNatureCorrectionImp {
  isWithoutCorrection?: boolean;
  selicStartDate?: string;
  selicEndDate?: string;
}

export default interface IMonetaryCorrectionParams {
  date: string | Date;
  updateTo: string | Date;
  value: number;
  indexId?: number;
  account?: MonetaryCorrectionAccountImp;
  memCalcs?: MemCalcImp[];
  indicadorDados?: IndicadorDadoHasMemTabImp[];
  details?: boolean;
  decimalCases?: number;
  administrativeNatureCorrection?: AdministrativeNatureCorrectionImp;
}

export interface MonetaryCorrectionAccountImp {
  proRataOtn?: boolean;
  positive?: boolean;
  purges?: PurgeItemImp[];
}
