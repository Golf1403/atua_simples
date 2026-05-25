import { UserImp } from '@/hooks/user';

export default interface LicenseInfoResponseImp {
  id: string | number;
  planId: string;
  frequencyId: string;
  frequencyDays: number;
  usersQuantity: number;
  paymentInfo: {
    value: number;
    paymentType: 'cc' | 'bb';
    cardNumber: string;
    cardFlag: string;
  };
  user?: UserImp;
}
