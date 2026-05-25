import IMonetaryRegister from './MonetaryRegisterImp';
import MonetaryInterestImp from './MonetaryInterestImp';
import MonetaryFineImp from './MonetaryFineImp';
import InterestIndexesImp from './InterestIndexesImp';

export interface PaymentFineImp extends MonetaryFineImp {
  paymentId?: number;
}

export default interface PaymentImp extends IMonetaryRegister {
  interests: MonetaryInterestImp[];
  fines: PaymentFineImp[];
  date: string;
}
