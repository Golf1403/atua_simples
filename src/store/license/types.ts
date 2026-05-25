import { DataTableCellImp } from '@interfaces/DataTableImp';
import LicenseImp from '@interfaces/licenses/LicenseImp';

export interface ILicenseResponse {
  id: string;
  group: string;
  email: string;
  plan?: string;
  master: boolean;
  lastName: string;
  firstName: string;
  createdAt: boolean;
  updatedAt: boolean;
  groupName: string;
  treatment?: string;
  licensename: string;
}

export enum LicenseActionTypes {
  SET_TOTAL = '@@license/SET_TOTAL',
  RESET_ALL_DATA = '@@license/RESET_ALL_DATA',
  SET_IN_USE = '@@license/SET_IN_USE',
  SET_LICENSE = '@@license/SET_LICENSE',
  SET_AVAIBLE = '@@license/SET_AVAIBLE',
  ADD_TO_TOTAL = '@@license/ADD_TO_TOTAL',
  SET_ALL_USERS = '@@license/SET_ALL_USERS',
  ADD_TO_IN_USE = '@@license/ADD_TO_IN_USE',
  ADD_TO_AVAIBLE = '@@license/ADD_TO_AVAIBLE',
  SET_IN_USE_LICENSES = '@@license/SET_IN_USE_LICENSES',
  SET_AVAIBLE_LICENSES = '@@license/SET_AVAIBLE_LICENSES',
}

export interface LicenseState {
  readonly total: number;
  readonly inUse: number;
  readonly avaible: number;
  readonly allLicenses: DataTableCellImp[] | null;
  readonly inUseLicenses: LicenseImp[];
  readonly avaibleLicenses: LicenseImp[];
}
