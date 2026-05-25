export interface IndicatorResponseImp {
  date: string;
  coinSign: string;
  index: {
    id: number;
    name: string;
    type: string;
  };
  percentual: string;
  value: string;
  convertedValue: string;
}
