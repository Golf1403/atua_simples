import { action } from 'typesafe-actions';
import { SimpleActionTypes } from '../../types';
import SimpleAuthorImp from '@interfaces/calculations/SimpleAuthorImp';

export interface EditAuthorLayoutImp {
  data: SimpleAuthorImp;
  key: number;
}

export const showAuthorModal = () => action(SimpleActionTypes.SHOW_AUTHOR_MODAL);
export const showEditAuthorModal = (payload: EditAuthorLayoutImp) =>
  action(SimpleActionTypes.SHOW_EDIT_AUTHOR_MODAL, payload);
