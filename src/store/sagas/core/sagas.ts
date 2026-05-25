import { takeEvery } from 'redux-saga/effects';
import { CoreActionTypes } from '../../core/types';
import { onSelectCostCenter, onSelectCostCenterOptions } from './';

export default [
  takeEvery(CoreActionTypes.SET_SELECTED_COST_CENTER, onSelectCostCenter),
  takeEvery(CoreActionTypes.PRE_SET_COST_CENTER_SELECT_OPTIONS, onSelectCostCenterOptions),
];
