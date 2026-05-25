import { IndicatorResponseImp } from '../serviceResponses/IndicatorResponseImp';
import CorrectionImp from './CorrectionImp';

export interface FeeCpcBaseImp {
  judgeStart: string;
  judgeEnd: string;
  judgeValue: number;
  judgePercentage: number;
  monetaryCorretionSince?: string;
}

export interface FeeCpcImp extends Omit<FeeCpcBaseImp, 'percentage'> {
  minimumWage: {
    date: string;
    value: number;
  };
  numberSalary: number;
  convictionDate: string;
  generalValue: number;
  calculateCheck: boolean;
  feePercentageRanges: { shortText: string; value: number; percentage: number; total: number }[];
  totalRanges: number;
  judgePercentage: number;
  judgeTotal: number;
  judgeCorrectedValue: number;
  judgeInterestValue: number;
  monetaryCorretionSince: string;
  total: number;
  value: number;
  indicadorDado?: IndicatorResponseImp[];
}

export default interface FeeImp {
  id?: string;
  type: string;
  percentage: number;
  value: number;
  calculated: number;
  correction?: CorrectionImp;
  order: number;
  newCpc: boolean;
  overInstallment?: boolean;
  date: string | null;
  feeCpc?: FeeCpcImp;
}
