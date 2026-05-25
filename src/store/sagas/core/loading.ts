import { put } from 'redux-saga/effects';
import { CoreActionTypes } from '../../core/types';

export function* showIndexesLoading() {
  yield put({
    type: CoreActionTypes.SET_IS_INDEXES_LOADING,
    payload: true,
  });
}

export function* stopIndexesLoading() {
  yield put({
    type: CoreActionTypes.SET_IS_INDEXES_LOADING,
    payload: false,
  });
}
