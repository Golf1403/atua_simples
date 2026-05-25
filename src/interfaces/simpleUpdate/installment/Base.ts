import IAccount from '../../AccountImp';
import MemCalcImp from '../../MemCalcImp';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import { FactorImp } from '@/interfaces/FactorImp';
import { AdministrativeNatureCorrectionImpHasFactorsList, MemCalcHasFactorsImp } from '@/store/simple/types';
import SimpleAuthorImp from '@/interfaces/calculations/SimpleAuthorImp';

export default interface Base {
  account: IAccount;
  interestIndexes: InterestIndexesImp;
  authors: SimpleAuthorImp[];
  memCalcHasFactors: MemCalcHasFactorsImp[];
  memCalcs: MemCalcImp[];
  factors?: FactorImp;
  administrativeNatureCorrectionFactors: AdministrativeNatureCorrectionImpHasFactorsList;
}

export interface BaseReponse {
  authors: SimpleAuthorImp[];
  memCalcs: MemCalcImp[];
  factors?: Map<string, FactorImp>;
  administrativeNatureCorrectionFactors?: AdministrativeNatureCorrectionImpHasFactorsList;
}
