import SimpleInstallmentImp from './SimpleInstallmentImp';
import PaymentImp from './PaymentImp';
import MonetaryFine523Imp from './MonetaryFine523Imp';

export default interface SimpleAuthorImp {
  id?: string;
  name: string;
  installments: SimpleInstallmentImp[];
  payments: PaymentImp[];
  fine523?: MonetaryFine523Imp;
  total: number;
  installmentsTotal: number;
  installmentsInterestTotal: number;
  installmentsFinesTotal: number;
  paymentsTotal: number;
  interestTotal: number;
  finesTotal: number;
}
