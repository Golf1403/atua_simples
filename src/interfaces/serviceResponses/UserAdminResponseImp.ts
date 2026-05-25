import { DataTableCellImp } from '@interfaces/DataTableImp';

interface InUseLicense {
  id: string;
  licenseId: string;
  licensePacmentId: 24;
  planHasFrequencyId: string;
  createdAt: string;
  user: DataTableCellImp;
}

export default interface UserAdminResponseImp {
  avaible: number;
  avaibleLicenses: InUseLicense[];
  inUse: number;
  total: number;
  inUseLicenses: InUseLicense[];
}

export interface ListUsersResponseImp {
  avaible: number;
  avaibleLicenses: InUseLicense[];
  inUse: number;
  total: number;
  inUseLicenses: InUseLicense[];
  allLicenses: DataTableCellImp[];
}
