import SimpleAuthorImp from '../../calculations/SimpleAuthorImp';
import Base from './Base';

export default interface DeleteImp extends Base {
  authors: SimpleAuthorImp[];
  authorIndex: number;
  installmentIndex: number;
}
