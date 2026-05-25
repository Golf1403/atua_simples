import { action } from 'typesafe-actions';
import { AuthActionTypes } from './types';

export const setIsLoading = (isLoading: boolean) => action(AuthActionTypes.SET_IS_LOADING, isLoading);
export const setIsRefreshLoading = (payload: boolean) => action(AuthActionTypes.SET_IS_REFRESH_LOADING, payload);
export const setIsRefreshError = () => action(AuthActionTypes.SEI_IS_REFRESH_ERROR);
export const setIsRefreshEnter = (payload: boolean) => action(AuthActionTypes.SET_IS_REFRESH_ENTER, payload);
export const setIsRefreshSuccess = (payload?: any) => action(AuthActionTypes.SEI_IS_REFRESH_SUCCESS, payload);
export const logout = () => action(AuthActionTypes.LOGOUT);
