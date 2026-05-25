//fee

import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import SimpleAuthorImp from '@interfaces/calculations/SimpleAuthorImp';

export const setAuthors = (payload: SimpleAuthorImp[]) => action(SimpleActionTypes.SET_AUTHORS, payload);

export * from './layout';
