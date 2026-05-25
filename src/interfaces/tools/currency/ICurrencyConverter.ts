export interface ICurrencyConverterResponse {
  from: string;
  result: string;
  to: string;
  value: string;
}

export interface ICurrencyConverterRequest {
  from: string;
  to: string;
  value: string;
}
