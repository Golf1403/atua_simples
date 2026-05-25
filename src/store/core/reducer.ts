import { Reducer } from 'redux';
import { CoreState, CoreActionTypes } from './types';
// import { AutomatedActionTypes } from '../automated/types';

const initialState: CoreState = {
  indexes: [],
  isLoading: false,
  loadingMessage: '',
  isProfilesLoading: false,
  costCenterSelectOptions: [],
  costCenters: null,
  selectedCostCenter: undefined,
  isIndexesLoading: null,
  calculationFieldsDisabled: true,
  profiles: null,
  error: null,
};

const reducer: Reducer<CoreState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CoreActionTypes.SET_INDEXES:
      return { ...state, indexes: payload };
    case CoreActionTypes.SET_PROFILES:
      return { ...state, profiles: payload };
    case CoreActionTypes.SET_IS_LOADING:
      return { ...state, isLoading: payload };
    case CoreActionTypes.SET_ERROR:
      return { ...state, error: payload };
    case CoreActionTypes.SET_IS_INDEXES_LOADING:
      return { ...state, isIndexesLoading: payload };
    case CoreActionTypes.SET_COST_CENTER_SELECT_OPTIONS:
      return { ...state, costCenterSelectOptions: payload };
    case CoreActionTypes.SET_COST_CENTERS:
      return { ...state, costCenters: payload };
    case CoreActionTypes.SET_SELECTED_COST_CENTER:
      return { ...state, selectedCostCenter: payload.costCenterId };
    case CoreActionTypes.SET_IS_PROFILES_LOADING:
      return { ...state, isProfilesLoading: payload };
    case CoreActionTypes.SET_CALCULATION_FIELDS_DISABLED:
      return { ...state, calculationFieldsDisabled: payload };
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default:
      return state;
  }
};

export { reducer as coreReducer };
