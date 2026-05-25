import PaymentImp from '../../calculations/PaymentImp';
import Base from './Base';

export default interface UpdateImp extends Base {
  payment: PaymentImp;
  authorIndex: number;
  paymentIndex: number;
}
