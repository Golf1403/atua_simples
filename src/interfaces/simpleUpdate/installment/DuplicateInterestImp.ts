import MonetaryInterestImp from '../../calculations/MonetaryInterestImp';
import Base from './Base';

export default interface DuplicateInterestImp extends Base {
  authorIndex: number;
  paymentIndex: number;
  interestIndex: number;
  interest: MonetaryInterestImp;
}
