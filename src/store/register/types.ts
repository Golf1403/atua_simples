import IPlanType from '@interfaces/plans/PlanTypeImp';
import { RegisterDataImp } from '@interfaces/RegisterDataImp';

export interface IRegisterResponse {
  register: string;
  paymentStatus: string;
}

export interface INavigationItem {
  text: string;
  isValid: boolean;
}

export enum RegisterActionTypes {
  SET_REGISTER_STEP_ONE = '@@register/SET_REGISTER_STEP_ONE',
  SET_REGISTER_STEP_TWO = '@@register/SET_REGISTER_STEP_TWO',
  SET_REGISTER_STEP_THREE = '@@register/SET_REGISTER_STEP_THREE',
  SET_REGISTER_FOCUS_ON_STEP = '@@register/SET_REGISTER_FOCUS_ON_STEP',
  SET_REGISTER_INITIAL_STATE = '@@register/SET_REGISTER_INITIAL_STATE',
  SET_REGISTER_SELECTED_PLAN = '@@register/SET_REGISTER_SELECTED_PLAN',
  SET_REGISTER_BILLING_FREQUENCY = '@@register/SET_REGISTER_BILLING_FREQUENCY',
  SET_REGISTER_SUB_TOTAL = '@@register/SET_REGISTER_SUB_TOTAL',
}

export interface RegisterState {
  readonly stepsNav: INavigationItem[];
  readonly activeStep: number;
  readonly billingFrequency: 'monthly' | 'yearly';
  readonly selectedPlan: null | IPlanType;
  readonly subTotal: number;
  readonly registerData: RegisterDataImp;
}
