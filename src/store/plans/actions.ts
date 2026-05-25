import { action } from 'typesafe-actions';
import { PlansActionTypes, IFrequencies } from './types';

export const setFrequencies = (data: IFrequencies) => action(PlansActionTypes.SET_FREQUENCIES, data);
export const setSelectedFrequency = (data: object) => action(PlansActionTypes.SET_SELETED_FREQUENCY, data);
