import MonetaryInterestResponseImp from './MonetaryInterestResponseImp';
import MonetaryFineResponseImp from './MonetaryFineResponseImp';

export default interface PaymentResponseImp {
  id: string;
  description: string;
  date: string;
  value: string;
  capitalization?: string;
  civilCode?: string;
  index?: string;
  formula?: string;
  order: string;
  interests?: MonetaryInterestResponseImp[];
  fines?: MonetaryFineResponseImp[];
  correctedValue: number;
}
