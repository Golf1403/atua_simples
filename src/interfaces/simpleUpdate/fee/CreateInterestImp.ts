import MonetaryInterestImp from '../../calculations/MonetaryInterestImp';
import Base from './Base';

export default interface CreateInterestImp extends Base {
  authorIndex: number;
  paymentIndex: number;
  interest: MonetaryInterestImp;
}
