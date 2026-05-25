import { Reducer } from 'redux';
import { LicenseState, LicenseActionTypes } from './types';
import { CoreActionTypes } from '../core/types';

const initialState: LicenseState = {
  avaible: 0,
  avaibleLicenses: [],
  inUse: 0,
  inUseLicenses: [],
  allLicenses: null,
  total: 0,
};

const reducer: Reducer<LicenseState> = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LicenseActionTypes.SET_IN_USE:
      return { ...state, inUse: payload };
    case LicenseActionTypes.SET_IN_USE_LICENSES:
      return { ...state, inUseLicenses: payload };
    case LicenseActionTypes.SET_AVAIBLE_LICENSES:
      return { ...state, avaibleLicenses: payload };
    case LicenseActionTypes.SET_AVAIBLE:
      return { ...state, avaible: payload };
    case LicenseActionTypes.ADD_TO_AVAIBLE:
      return { ...state, total: state.total + payload };
    case LicenseActionTypes.ADD_TO_IN_USE:
      return { ...state, total: state.total + payload };
    case LicenseActionTypes.ADD_TO_TOTAL:
      return { ...state, total: state.total + payload };
    case LicenseActionTypes.SET_TOTAL:
      return { ...state, total: payload };
    case LicenseActionTypes.SET_ALL_USERS:
      return { ...state, allLicenses: payload };
    case LicenseActionTypes.RESET_ALL_DATA:
      return initialState;
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }

    default:
      return state;
  }
};

export { reducer as licenseReducer };
