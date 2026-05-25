export default interface MonetaryInterestResponseImp {
  id?: string;
  installmentId?: string;
  paymentId?: string;
  type: string;
  periodicity: string;
  dateStart: string;
  dateEnd: string;
  percentage: string;
  capitalization: string;

  onInstallmentsValue: string;
  onDefaultInterest: string;
  onCompensatoryInterest: string;
  onCompoundInterest: string;
  onInterestPeriod: string;

  civilCode?: string;
  index?: string;
  formula?: string;
}
