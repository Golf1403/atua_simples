import { typeFeeArt, typeFineArt } from '@/hooks/interfaces/CurrentAccountHookImp';

export interface CurrentFeeFineCommonImp {
  dateEnd: string;
  tax: number;
  value: number;
  isCorrection?: boolean;
  description: string;
  afterTotal: boolean;
}

export interface CurrentFeeRestImp extends CurrentFeeFineCommonImp {
  type: typeFeeArt.id;
  dateStart: string;
}

export interface CurrenFineRestImp extends CurrentFeeFineCommonImp {
  type: typeFineArt.id;
}

type CurrentFeeFineImp = CurrentFeeRestImp | CurrenFineRestImp;

export default CurrentFeeFineImp;
