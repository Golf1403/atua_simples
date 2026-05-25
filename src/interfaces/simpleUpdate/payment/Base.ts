import SimpleAuthorImp from '../../calculations/SimpleAuthorImp';
import IAccount from '../../AccountImp';
import MemCalcImp from '../../MemCalcImp';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import { FactorImp } from '@/interfaces/FactorImp';
import { MemCalcHasFactorsImp } from '@/store/simple/types';

export default interface Base {
  memCalcHasFactors: MemCalcHasFactorsImp[];
  authors: SimpleAuthorImp[];
  account: IAccount;
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp;
  factors?: FactorImp;
}
