import { action } from 'typesafe-actions';
import CostCenterImp from '@interfaces/costCenters/CostCenterImp';
import IAccessProfileResponse from '@interfaces/serviceResponses/AccessProfileResponseImp';
import { CoreActionTypes, IError } from './types';

export const setSelectedCostCenter = (payload: string | number) =>
  action(CoreActionTypes.SET_SELECTED_COST_CENTER, { costCenterId: payload });

export const setCostCenters = (payload: CostCenterImp[]) => action(CoreActionTypes.SET_COST_CENTERS, payload);

export const setIsLoading = (payload: boolean) => action(CoreActionTypes.SET_IS_LOADING, payload);

export const setIsProfilesLoading = (payload: boolean) => action(CoreActionTypes.SET_IS_PROFILES_LOADING, payload);

export const resetCoreData = () => action(CoreActionTypes.RESET_ALL_DATA);

export const setProfiles = (payload: IAccessProfileResponse[]) => action(CoreActionTypes.SET_PROFILES, payload);

export const setError = (payload: IError) => action(CoreActionTypes.SET_ERROR, payload);

export const setCostCenterSelectOptions = (payload: CostCenterImp[]) =>
  action(CoreActionTypes.PRE_SET_COST_CENTER_SELECT_OPTIONS, payload);
