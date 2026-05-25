import { Store, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';
import { ApplicationState, createRootReducer } from './index';

export default function configureStore(initialState: ApplicationState): Store<ApplicationState> {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(createRootReducer(), initialState, applyMiddleware(thunk, sagaMiddleware));

  sagaMiddleware.run(mySaga);

  return store;
}
