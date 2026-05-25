import { all } from 'redux-saga/effects';
import coreSagas from './core/sagas';

export default function* rootSaga() {
  yield all([...coreSagas]);
}
