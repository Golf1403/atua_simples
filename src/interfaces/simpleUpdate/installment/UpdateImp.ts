import FeeImp from '@/interfaces/calculations/FeeImp';
import Base from './Base';

export default interface UpdateImp extends Base {
  fee: FeeImp;
  feeIndex: number;
}
