import PurgeItemImp from './PurgeItemImp';

export default interface CorrectionDetailImp {
  date?: Date | string;
  coin?: string;
  value?: number;
  index?: string;
  correction?: number;
  unit?: string;
  indexOriginal?: number;
  indexUsed?: number;
  indexImp?: string;
  apply61702?: number;
  purge?: PurgeItemImp;
  conversion?: number;
}
