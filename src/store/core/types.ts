import CostCenterImp from '@interfaces/costCenters/CostCenterImp';
import ISelectOption from '@interfaces/SelectOptionImp';
import IAccessProfileResponse from '@interfaces/serviceResponses/AccessProfileResponseImp';
import { IndexResponseImp } from '@interfaces/serviceResponses/IndexResponseImp';

export enum CoreActionTypes {
  RESET_ALL_DATA = '@@core/RESET_ALL_DATA',
  SET_IS_INDEXES_LOADING = '@@core/SET_IS_INDEXES_LOADING',
  SET_IS_PROFILES_LOADING = '@@core/SET_IS_PROFILES_LOADING',
  SET_INDEXES = '@@core/SET_INDEXES',
  SET_PROFILES = '@@core/SET_PROFILES',
  SET_COST_CENTERS = '@@core/SET_COST_CENTERS',
  SET_PROFILES_LIST = '@@core/SET_PROFILES_LIST',
  SET_PROFILES_PAGINATION = '@@core/SET_PROFILES_PAGINATION',
  SET_SELECTED_COST_CENTER = '@@core/SET_SELECTED_COST_CENTER',
  PRE_SET_COST_CENTER_SELECT_OPTIONS = '@@core/PRE_SET_COST_CENTER_SELECT_OPTIONS',
  SET_COST_CENTER_SELECT_OPTIONS = '@@core/SET_COST_CENTER_SELECT_OPTIONS',
  SET_CALCULATION_FIELDS_DISABLED = '@@core/SET_CALCULATION_FIELDS_DISABLED',
  SET_IS_LOADING = '@@core/SET_IS_LOADING',
  SET_ERROR = '@@core/SET_ERROR',
}

export interface IError {
  msg: string;
  status: number;
}
export interface CoreState {
  readonly loadingMessage: string;
  readonly indexes: IndexResponseImp[];
  readonly isLoading: boolean;
  readonly isProfilesLoading: boolean;
  readonly costCenters: CostCenterImp[] | null;
  readonly error: IError | null;
  readonly profiles: IAccessProfileResponse[] | null;
  readonly isIndexesLoading: IAccessProfileResponse[] | null;
  readonly selectedCostCenter?: string;
  readonly costCenterSelectOptions: ISelectOption[];
  readonly calculationFieldsDisabled: boolean;
}
