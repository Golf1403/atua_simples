export interface IRetroactorRequest {
  from: string;
  indexId: string;
  to: string;
  value: string;
}

export interface IRetroactorResponse {
  from: string;
  indexId: string;
  to: string;
  value: number;
  result: string;
}
