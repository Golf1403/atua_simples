import SimpleInstallmentResponseImp from './SimpleInstallmentResponseImp';
import PaymentResponseImp from './PaymentResponseImp';
import ExpenseResponseImp from './ExpenseResponseImp';
import FeeResponseImp from './FeeResponseImp';
import PurgeResponseImp from './PurgeResponseImp';

export default interface SimpleCalculationResponseImp {
  id: string;
  costCenter: string;
  accountName: string;
  updateUntil: string;
  calculationIndex: string;
  indexNegative: string;
  proRataOtn?: string;
  dayCheck?: string;
  calculationRecords: string;
  court: string;
  defendant: string;
  calculationNote: string;
  purges: PurgeResponseImp[];
  recordId: string;
  observation: string;
  authors?: {
    id: string;
    name: string;
    installments?: SimpleInstallmentResponseImp[];
    payments?: PaymentResponseImp[];
    expenses?: ExpenseResponseImp[];
    fees?: FeeResponseImp[];
  }[];
}
