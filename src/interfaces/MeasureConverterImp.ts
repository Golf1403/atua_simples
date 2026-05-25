export default interface MeasureConverterImp {
  from: string;
  to: string;
  type: string;
  value: number;
}

export interface CalculatorImp {
  calculate(): any;
}
