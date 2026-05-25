import IAccount from '../../AccountImp';
import MemCalcImp from '../../MemCalcImp';
import InterestIndexesImp from '@/interfaces/calculations/InterestIndexesImp';
import { FactorImp } from '@/interfaces/FactorImp';
import ExpenseImp from '@/interfaces/calculations/ExpenseImp';
import { MemCalcHasFactorsImp } from '@/store/simple/types';

export default interface Base {
  memCalcHasFactors: MemCalcHasFactorsImp[];
  expenses: ExpenseImp[];
  account: IAccount;
  memCalcs: MemCalcImp[];
  interestIndexes: InterestIndexesImp;
  factors?: FactorImp;
}
