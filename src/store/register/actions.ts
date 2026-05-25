import { action } from 'typesafe-actions';
import { RegisterActionTypes } from './types';
import IPlanType from '@interfaces/plans/PlanTypeImp';

export const setRegisterStepOne = (data: object) => action(RegisterActionTypes.SET_REGISTER_STEP_ONE, data);
export const setRegisterStepTwo = (data: object) => action(RegisterActionTypes.SET_REGISTER_STEP_TWO, data);
export const setRegisterStepThree = (data: object) => action(RegisterActionTypes.SET_REGISTER_STEP_THREE, data);

export const setFocusOnStep = (stepNumber: number) =>
  action(RegisterActionTypes.SET_REGISTER_FOCUS_ON_STEP, stepNumber);
export const resetRegister = () => action(RegisterActionTypes.SET_REGISTER_INITIAL_STATE);

export const setSelectedPlan = (planData: IPlanType) =>
  action(RegisterActionTypes.SET_REGISTER_SELECTED_PLAN, planData);
export const setSubTotal = (subTotal: number) => action(RegisterActionTypes.SET_REGISTER_SUB_TOTAL, subTotal);
export const setBillingFrequency = (billingFrequency: string) =>
  action(RegisterActionTypes.SET_REGISTER_BILLING_FREQUENCY, billingFrequency);
