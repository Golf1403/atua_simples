import IAccount from '../../AccountImp';
import MemCalcImp from '../../MemCalcImp';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import { FactorImp } from '@/interfaces/FactorImp';
import FeeImp from '@/interfaces/calculations/FeeImp';
import { MemCalcHasFactorsImp } from '@/store/simple/types';

export default interface Base {
  memCalcHasFactors: MemCalcHasFactorsImp[];
  fees: FeeImp[];
  account: IAccount;
  memCalcs: MemCalcImp[];
  isTest?: boolean;
  interestIndexes: InterestIndexesImp;
  factors?: FactorImp;
}
