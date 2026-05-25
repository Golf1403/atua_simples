import { Reducer } from 'redux';
import { initialActions } from './payload';
import { LayoutState, LayoutActionTypes } from './types';
import { CoreActionTypes } from '../core/types';

const initialState: LayoutState = initialActions;

const reducer: Reducer<LayoutState> = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LayoutActionTypes.ACTIVE_SIDEBAR: {
      return { ...state, sideBar: { visible: true } };
    }
    case LayoutActionTypes.HIDDEN_SIDEBAR: {
      return { ...state, sideBar: { visible: false } };
    }
    case LayoutActionTypes.HIDDEN_OR_ACTIVE_SIDEBAR: {
      return { ...state, sideBar: { visible: !state.sideBar.visible } };
    }
    case CoreActionTypes.RESET_ALL_DATA: {
      return initialState;
    }
    default:
      return state;
  }
};

export { reducer as layoutReducer };
