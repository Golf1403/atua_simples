import { action } from 'typesafe-actions';
import { LayoutActionTypes } from './types';

export const activeSideBar = () => action(LayoutActionTypes.ACTIVE_SIDEBAR);
export const hiddenSideBar = () => action(LayoutActionTypes.HIDDEN_SIDEBAR);
export const onHiddenOrActiveSideBar = () => action(LayoutActionTypes.HIDDEN_OR_ACTIVE_SIDEBAR);
