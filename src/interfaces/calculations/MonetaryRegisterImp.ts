import CorrectionImp from './CorrectionImp';

export default interface MonetaryRegisterImp {
  id?: string;
  description: string;
  date: Date | string;
  value: number;
  order: number;
  correction?: CorrectionImp;
  correctedValue: number;
}
