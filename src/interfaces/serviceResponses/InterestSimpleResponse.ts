import CorrectionDetailImp from '../calculations/CorrectionDetailImp';
import { PeriodImp } from '../calculations/MonetaryFineImp';
export default interface InterestSimpleResponse {
  periods: PeriodImp[];
  result: number;
  value: number;
  totalPercentage: number;
  withoutTaxCorrection?: boolean;
  installmentDetails?: CorrectionDetailImp[];
}
