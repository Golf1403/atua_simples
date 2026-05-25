export default interface MonetaryFine523Imp {
  id?: string;
  percentageCharged: number;
  discBaseValue: boolean;
  chargedOnTotalInstallments: boolean;
  chargedOnTotalInterests: boolean;
  chargedOnTotalInstallmentsFines: boolean;
  chargedOnTotalFees: boolean;
  chargedOnTotalExpenses: boolean;
  deductPayments: boolean;
  advisorFees: number;
  feeOnTotalInstallments: boolean;
  feeOnTotalInterests: boolean;
  feeOnTotalInstallmentsFines: boolean;
  feeOnTotalFees: boolean;
  feeOnTotalExpenses: boolean;
  feeOnFine523: boolean;
  value: number;
  fineTotal: number;
  feeTotal: number;
  fineValue: number;
  feeValue: number;
}
