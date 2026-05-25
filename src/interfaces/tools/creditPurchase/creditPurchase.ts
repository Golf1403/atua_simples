export interface ICreditPurchaseRequest {
  capital: string;
  incomingPayment: string;
  installments: string;
  installmentsValue: string;
}

export interface ICreditPurchaseResponse {
  capital: string;
  incomingPayment: string;
  installments: string;
  installmentsValue: string;
  installmentsTotal: string;
  amount: string;
  tax: string;
}
