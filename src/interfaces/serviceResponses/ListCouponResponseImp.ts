import CouponResponseImp from './CouponResponseImp';

export interface ListCouponResponseImp {
  pagination: { current: number; pages: number; total: number };
  results: CouponResponseImp[];
}
