import { ActionsImp } from './types';
import { Dispatch } from 'redux';
import { activeSideBar, hiddenSideBar, onHiddenOrActiveSideBar } from './action';

export const initialActions: ActionsImp = {
  isLoading: false,
  sideBar: {
    visible: true,
  },
  activeSideBar: function (dispatch: Dispatch) {
    dispatch(activeSideBar());
  },
  hiddenSideBar: function (dispatch: Dispatch) {
    dispatch(hiddenSideBar());
  },
  onHiddenOrActiveSideBar: function (dispatch: Dispatch) {
    dispatch(onHiddenOrActiveSideBar());
  },
  setVisibleSideBar: function (dispatch: Dispatch) {
    this.onHiddenOrActiveSideBar(dispatch);
  },
};
