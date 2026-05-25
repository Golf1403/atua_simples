import { DetailedImp } from '@/interfaces/DetailedImp';
import { FactorImp } from '@/interfaces/FactorImp';
import IAccount from '@interfaces/AccountImp';
import MemCalcImp from '@interfaces/MemCalcImp';

export interface IGetMemCalcsWithFactors {
  account?: IAccount;
  date: string;
  value: number;
  details?: boolean;
  memCalcs: MemCalcImp[];
}

export interface IGetMemCalcsWithFactorsReponse {
  memCalcs: MemCalcImp[];
  detailedPositive: DetailedImp;
  detailedNegative: DetailedImp;
  factorsPositive: FactorImp;
  factorsNegative: FactorImp;
}
