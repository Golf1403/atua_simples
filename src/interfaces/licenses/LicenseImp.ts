export default interface LicenseImp {
  id: string | number;
  purchasedAt: Date;
  licenseId?: string | number;
  planFrequencyId?: string;
  planId: string;
  frequencyId: string;
  frequencyDays: number;
  usersQuantity: number;
}
