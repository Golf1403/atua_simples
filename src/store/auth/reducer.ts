import { Reducer } from 'redux';
import { AuthState, AuthActionTypes } from './types';
import defineAbilityFor from '../../casl';
import { CoreActionTypes } from '../core/types';

const initialState: AuthState = {
  isAuth: false,
  accessToken: null,
  isRefreshLoading: false,
  isRefreshEnter: false,
  errors: [],
  ability: defineAbilityFor(),
  isRefreshError: false,
  isLoading: false,
};

const reducer: Reducer<AuthState> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AuthActionTypes.SET_ACCESS_TOKEN: {
      return { ...state, accessToken: payload };
    }
    case AuthActionTypes.SET_IS_AUTH: {
      return { ...state, isAuth: payload };
    }
    case AuthActionTypes.SET_IS_REFRESH_ENTER: {
      return { ...state, isRefreshEnter: payload, isRefreshLoading: false };
    }
    case AuthActionTypes.SEI_IS_REFRESH_SUCCESS: {
      return { ...state, isRefreshLoading: false };
    }
    case AuthActionTypes.SET_ABILITY: {
      return { ...state, ability: payload };
    }
    case AuthActionTypes.SET_IS_LOADING: {
      return { ...state, isLoading: payload };
    }
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export { reducer as authReducer };
