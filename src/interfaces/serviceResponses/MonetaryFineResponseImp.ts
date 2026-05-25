export default interface MonetaryFineResponseImp {
  id?: string;
  installmentId?: string;
  periodicity: string;
  dateStart: string;
  dateEnd: string;
  valueType: string;
  value: string;

  type: string;

  onInstallmentsValue: string;
  onDefaultInterest: string;
  onCompensatoryInterest: string;
  onCompoundInterest: string;
  onInterestPeriod: string;
}
