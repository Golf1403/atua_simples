import AccountImp from '../AccountImp';
import MemCalcImp from '../MemCalcImp';
import CalculationMemoryImp from './CalculationMemoryImp';
import { AdministrativeNatureCorrectionImp } from './MonetaryCorrectionParamsImp';

export interface MonetaryCorrectionCalculateImp {
  date: string;
  value: number;
  administrativeNatureCorrection?: AdministrativeNatureCorrectionImp[];
  account: AccountImp;
  isTest?: boolean;
  memCalcs: MemCalcImp[];
}

export default interface CorrectionImp {
  calculationMemory?: CalculationMemoryImp;
  correctedCoin: string;
  inputCoin?: string;
  details?: [string, string][];
  value: number;
  identifier?: string;
  principalConverted?: number;
}
