export interface AutomatedUpdateAccountingPartImp {
  id?: string;
  name?: string;
  installments?: unknown[];
  payments?: unknown[];
}

export interface AutomatedUpdateExpenseImp {
  id?: string;
  description?: string;
  date?: string | Date;
  value?: number;
}

export interface AutomatedUpdateFeeImp {
  id?: string;
  description?: string;
  date?: string | Date;
  percentage?: number;
  value?: number;
}

export default interface AutomatedUpdateAccountImp {
  id?: string;
  costCenterId: string;
  name?: string;
  updateUntil?: string | Date;
  deflation: string;
  purges?: string;
  proDIA?: boolean;
  proOTN?: boolean;
  vara?: string;
  autos?: string;
  defendant?: string;
  observation?: string;
  indexId: number;
  onePercentSelic: boolean;
  accountingParts?: AutomatedUpdateAccountingPartImp[];
  expenses?: AutomatedUpdateExpenseImp[];
  fees?: AutomatedUpdateFeeImp[];
  createdAt?: string | Date;
}
