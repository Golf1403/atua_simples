import { Dispatch } from 'redux';

export enum LayoutActionTypes {
  RESET_ALL_DATA = '@@layout/RESET_ALL_DATA',
  ACTIVE_SIDEBAR = '@@layout/ACTIVE_SIDEBAR',
  HIDDEN_SIDEBAR = '@@layout/HIDDEN_SIDEBAR',
  HIDDEN_OR_ACTIVE_SIDEBAR = '@@layout/HIDDEN_OR_ACTIVE_SIDEBAR',
}

export interface IError {
  msg: string;
  status: number;
}
export interface ActionsImp {
  readonly isLoading: boolean;
  readonly sideBar: { visible: boolean };
  activeSideBar: (dispatch: Dispatch) => void;
  hiddenSideBar: (dispatch: Dispatch) => void;
  setVisibleSideBar: (dispatch: Dispatch) => void;
  onHiddenOrActiveSideBar: (dispatch: Dispatch) => void;
}

export type LayoutState = ActionsImp;
