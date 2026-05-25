import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';

export const showPrintModal = () => action(SimpleActionTypes.SHOW_PRINT_MODAL);
export const hidePrintModal = () => action(SimpleActionTypes.HIDE_PRINT_MODAL);
