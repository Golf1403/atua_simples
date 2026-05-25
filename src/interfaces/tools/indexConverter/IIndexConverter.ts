export interface IIndexConverterResponse {
  from: string;
  result: string;
  to: string;
  value: string;
}

export interface IIndexConverterRequest {
  date: string;
  index: string;
  indexId: string;
  value: string;
  dateStart: string;
  dateEnd?: string;
}
