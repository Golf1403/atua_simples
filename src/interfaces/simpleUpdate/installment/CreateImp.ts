import PaymentImp from '../../calculations/PaymentImp';
import Base from './Base';

export default interface CreateImp extends Base {
  authorIndex: number;
  payment: PaymentImp;
}
