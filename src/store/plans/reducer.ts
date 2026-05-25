import { Reducer } from 'redux';
import { PlansState, PlansActionTypes } from './types';
import { CoreActionTypes } from '../core/types';

const initialState: PlansState = {
  frequencies: {
    currentPage: 1,
    pages: 1,
    totalPages: 1,
    frequenciesList: [],
  },
  selectedFrequency: {
    id: '',
    plans: [],
    resourcesList: [],
  },
};

const reducer: Reducer<PlansState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case PlansActionTypes.SET_FREQUENCIES: {
      return {
        ...state,
        frequencies: payload,
      };
    }
    case PlansActionTypes.SET_SELETED_FREQUENCY: {
      return {
        ...state,
        selectedFrequency: payload,
      };
    }
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export { reducer as plansReducer };
