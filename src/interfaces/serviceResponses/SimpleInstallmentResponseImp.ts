import MonetaryInterestResponseImp from './MonetaryInterestResponseImp';
import MonetaryFineResponseImp from './MonetaryFineResponseImp';

export default interface SimpleInstallmentResponseImp {
  description: string;
  date: string;
  value: string;
  detailed: string;
  order: string;
  interests?: MonetaryInterestResponseImp[];
  fines?: MonetaryFineResponseImp[];
}
