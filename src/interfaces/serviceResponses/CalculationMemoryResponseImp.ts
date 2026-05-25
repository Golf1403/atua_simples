import MemCalcImp from '../MemCalcImp';

export default interface CalculationMemoryResponseImp {
  memCalc: MemCalcImp;
  start: Date | string;
  end: Date | string;
}
