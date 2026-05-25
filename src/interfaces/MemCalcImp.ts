import IndicadorDadoHasMemTabImp from './IndicadorDadoHasMemTabImp';
import IndicadorImp from './IndicadorImp';
import MemTabImp from './MemTabImp';

export default interface MemCalcImp {
  mecid: number;
  mecindid: number | string;
  mecmetid: number | string;
  mecnome: string;
  mecformula: string;
  mecunidade: string;
  mecstarta?: Date | string;
  mecstartc?: Date | string;
  mecenda?: Date | string;
  mecendc?: Date | string;
  indicador: IndicadorImp;
  memTab: MemTabImp;
  indicadorDado?: IndicadorDadoHasMemTabImp[];
}
