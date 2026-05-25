import PurgeItemImp from './calculations/PurgeItemImp';

export default interface AccountImp {
  id?: string;
  accountTypeId: number;
  costCenterId: string;
  deflation?: string;
  costCenterName?: string;
  name: string;
  observation: string;
  proRataDay: boolean;
  proRataOtn: boolean;
  date?: string;
  data?: string;
  recordId: string;
  courtId: string;
  indexId: number;
  defendantId: string;
  updateTo: string;
  purges?: PurgeItemImp[];
  positive: boolean;
  createdAt?: string;
  updateAt?: string;
  onePercentSelic?: boolean;
}
