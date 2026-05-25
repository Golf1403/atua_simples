export interface IMeasureConverter {
  from: string;
  to: string;
  type: string;
  value: string;
}

export interface IMeasureConverterResponse {
  from: string;
  to: string;
  type: string;
  value: number;
  result: string;
}
