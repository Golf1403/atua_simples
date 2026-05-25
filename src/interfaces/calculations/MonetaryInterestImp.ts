import { InterestTypesWithPeriodAndFine } from '@data/calculations/interestTypes';
import { PoupancaTypeIDS } from '@data/calculations/poupancaTypes';
import InterestSimpleResponse from '../serviceResponses/InterestSimpleResponse';
import CivilCodeInterest from '@/enums/CivilCodeInterest';

export type CapitalizedType = 'none' | 'monthly' | 'bimonthly' | 'quarterly' | 'fourmonths' | 'semiannual' | 'yearly';

export default interface MonetaryInterestImp {
  id?: string | number;
  installmentId?: number;
  paymentId?: number;
  expenseId?: number;
  type: InterestTypesWithPeriodAndFine;
  periodicity: string;
  dateStart: string;
  dateEnd: string;
  percentage: number;
  accountIndex?: number;
  capitalization: 'none' | 'monthly' | 'bimonthly' | 'quarterly' | 'fourmonths' | 'semiannual' | 'yearly';
  onInstallmentsValue?: boolean;
  onDefaultInterest?: boolean;
  onCompensatoryInterest?: boolean;
  onCompoundInterest?: boolean;
  onInterestPeriod?: boolean;
  onInterestWithoutCorrection?: boolean;
  onInterestSavings?: boolean;
  onTransitiveInterest: boolean;
  poupancaType?: PoupancaTypeIDS;
  index?: string;
  formula?: string;
  civilCodeDate?: string;
  administrativeNatureFirstDate?: string;
  administrativeNatureSecondDate?: string;
  administrativeNatureThirdDate?: string;
  calculatedInfo: InterestSimpleResponse;
  calculated: number;
  civilCode?: CivilCodeInterest;
}
