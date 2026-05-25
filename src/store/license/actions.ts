import { action } from 'typesafe-actions';
import { DataTableCellImp } from '@interfaces/DataTableImp';
import LicenseImp from '@interfaces/licenses/LicenseImp';
import { LicenseActionTypes, ILicenseResponse } from './types';

export const setAvaibleLicenses = (licenses: LicenseImp[]) => action(LicenseActionTypes.SET_AVAIBLE_LICENSES, licenses);

export const setAvaible = (total: number) => action(LicenseActionTypes.SET_AVAIBLE, total);

export const setAllLicenses = (user: DataTableCellImp[]) => action(LicenseActionTypes.SET_ALL_USERS, user);

export const setInUse = (total: number) => action(LicenseActionTypes.SET_IN_USE, total);

export const setInUseLicense = (licenses: LicenseImp[]) => action(LicenseActionTypes.SET_IN_USE_LICENSES, licenses);

export const setTotal = (total: number) => action(LicenseActionTypes.SET_TOTAL, total);

export const resetLicenseData = () => action(LicenseActionTypes.RESET_ALL_DATA);

export const setLicenseData = (licenseData: ILicenseResponse) => {
  return action(LicenseActionTypes.SET_LICENSE, licenseData);
};
