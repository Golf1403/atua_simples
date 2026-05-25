import PurgeItemImp from './PurgeItemImp';

export default interface CalculationBasicInfoImp {
  costCenter: string;
  accountName: string;
  updateUntil: Date;
  calculationIndex: string;
  indexNegative: string;
  proRataOtn?: boolean;
  dayCheck?: boolean;
  calculationRecords: string;
  court: string;
  defendant: string;
  calculationNote: string;
  purges: PurgeItemImp[];
  record: string;
  observation: string;
}
