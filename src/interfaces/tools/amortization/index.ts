export interface IAmortizationRequest {
  capital: string;
  amount: string;
  tax: string;
  installments: string;
  installmentsValue: string;
}

export interface IAmortizationResponse {
  capital: string;
  installments: string;
  installmentsValue: string;
  installmentsTotal: string;
  amount: string;
  tax: string;
}
