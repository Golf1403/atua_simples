import MemTabImp from './MemTabImp';

export default interface IndicadorDadoHasMemTabImp {
  inaid: number;
  inametid: number;
  inanome: string;
  inadata: string;
  inapercentual: number;
  inavalor: number;
  inachecked: boolean;
  memTab: MemTabImp;
}
