import MonetaryInterestImp from '../../calculations/MonetaryInterestImp';
import Base from './Base';

export default interface UpdateInterestImp extends Base {
  authorIndex: number;
  paymentIndex: number;
  interest: MonetaryInterestImp;
  interestIndex: number;
}
