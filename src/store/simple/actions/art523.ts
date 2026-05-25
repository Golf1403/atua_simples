//art 523

import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../types';

import MonetaryFine523Imp from '@interfaces/calculations/MonetaryFine523Imp';

export const setArt523 = (payload: MonetaryFine523Imp) => action(SimpleActionTypes.SET_ART_523, payload);

export const submitArt523 = (payload: MonetaryFine523Imp) =>
  action(SimpleActionTypes.SUBMIT_ART_523, { art523: payload });

export const onCheckArt523 = (payload: boolean) => action(SimpleActionTypes.ON_CHECK_ART_523, { isChecked: payload });

export const setCheckArt523 = (payload: boolean) => action(SimpleActionTypes.SET_CHECK_ART_523, payload);
