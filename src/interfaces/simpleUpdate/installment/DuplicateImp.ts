import PaymentImp from '../../calculations/PaymentImp';
import Base from './Base';

export default interface IDuplicate extends Base {
  authorIndex: number;
  paymentIndex: number;
  payment: PaymentImp;
  newDateOneMonthForward: string;
}
