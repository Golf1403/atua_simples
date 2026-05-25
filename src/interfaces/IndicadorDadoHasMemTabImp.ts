import { IndicadorDadoImp } from './IndicadorDadoImp';
import MemTabImp from './MemTabImp';

export default interface IndicadorDadoHasMemTabImp extends IndicadorDadoImp {
  memTab: MemTabImp;
}
