import { Ability, AbilityTuple, MongoQueryOperators, Subject } from '@casl/ability';

export interface IAuthResponse {
  token: string;
  refreshToken: string;
}

export enum AuthActionTypes {
  SET_ACCESS_TOKEN = '@@auth/SET_ACCESS_TOKEN',
  IS_AUTH_VERIFY = '@@auth/IS_AUTH_VERIFY',
  SET_IS_LOADING = '@@auth/SET_IS_LOADING',
  SET_IS_REFRESH_LOADING = '@@auth/SET_IS_REFRESH_LOADING',
  SEI_IS_REFRESH_ERROR = '@@auth/SEI_IS_REFRESH_ERROR',
  SEI_IS_REFRESH_SUCCESS = '@@auth/SEI_IS_REFRESH_SUCCESS',
  SET_IS_REFRESH_ENTER = '@@auth/SET_IS_REFRESH_ENTER',
  CHECK_ACCESS = '@@auth/SET_ACCESS',
  SET_IS_AUTH = '@@auth/SET_IS_AUTH',
  SET_ABILITY = '@@auth/SET_ABILITY',
  SET_ERROR = '@@auth/SET_ERROR',
  LOGOUT = '@@auth/LOGOUT',
}

export interface AuthState {
  readonly isAuth: boolean;
  readonly isRefreshEnter: boolean;
  readonly isRefreshLoading: boolean;
  readonly isRefreshError: boolean;
  readonly isLoading: boolean;
  readonly accessToken: string | null;
  readonly errors?: string[];
  readonly ability: Ability<
    AbilityTuple<string, Subject>,
    Record<
      string | number | symbol,
      string | number | boolean | Record<string | number | symbol, any> | MongoQueryOperators | null | undefined
    >
  >;
}
