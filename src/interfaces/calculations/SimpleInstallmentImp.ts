import MonetaryRegisterImp from './MonetaryRegisterImp';
import MonetaryInterestImp from './MonetaryInterestImp';
import MonetaryFineImp from './MonetaryFineImp';
import CorrectionDetailImp from './CorrectionDetailImp';
import { IndicatorResponseImp } from '../serviceResponses/IndicatorResponseImp';
import CorrectionImp from './CorrectionImp';
import { FactorImp } from '../FactorImp';

export interface SimpleInstallmentFineImp extends MonetaryFineImp {
  installmentId?: number;
}

export default interface SimpleInstallmentImp extends MonetaryRegisterImp {
  correction?: CorrectionImp;
  detailed: boolean;
  interests: MonetaryInterestImp[];
  fines: SimpleInstallmentFineImp[];
  total: number;
  date: string;
  factors?: FactorImp;
  indicadorDado?: IndicatorResponseImp[];
  principalConverted?: number;
  principalCorrected?: number;
  installmentDetails?: CorrectionDetailImp[];
}
